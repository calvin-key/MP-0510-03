import { prisma } from "./prisma";
import cron from "node-cron";

const checkExpiredTransactions = async () => {
  const now = new Date();

  // Get transactions that need to be expired/canceled
  const expiredTransactions = await prisma.transaction.findMany({
    where: {
      status: "waiting_for_payment",
      expiresAt: { lte: now },
    },
    include: {
      items: {
        include: {
          ticketType: true,
        },
      },
    },
  });

  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const canceledTransactions = await prisma.transaction.findMany({
    where: {
      status: "waiting_for_admin_confirmation",
      createdAt: { lte: threeDaysAgo },
    },
    include: {
      items: {
        include: {
          ticketType: true,
        },
      },
    },
  });

  // Handle both expired and canceled transactions
  for (const transaction of [...expiredTransactions, ...canceledTransactions]) {
    await prisma.$transaction(async (tx) => {
      // 1. Restore points if used
      if (transaction.pointsUsed > 0) {
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            pointsBalance: {
              increment: transaction.pointsUsed,
            },
          },
        });
      }

      // 2. Restore voucher usage if used
      if (transaction.voucherId) {
        await tx.voucher.update({
          where: { id: transaction.voucherId },
          data: {
            usageCount: {
              decrement: 1,
            },
          },
        });

        await tx.voucherUsage.delete({
          where: {
            userId_voucherId: {
              userId: transaction.userId,
              voucherId: transaction.voucherId,
            },
          },
        });
      }

      // 3. Restore coupon
      if (transaction.couponId) {
        await tx.userCoupon.updateMany({
          where: {
            userId: transaction.userId,
            couponId: transaction.couponId,
          },
          data: {
            isUsed: false,
          },
        });
      }

      // 4. Restore available seats
      for (const item of transaction.items) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            availableSeats: {
              increment: item.quantity,
            },
          },
        });
      }

      // 5. Update transaction status
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status:
            transaction.status === "waiting_for_payment"
              ? "expired"
              : "canceled",
        },
      });
    });
  }
};

cron.schedule("*/5 * * * *", async () => {
  console.log("Running transaction cleanup cron job...");
  try {
    await checkExpiredTransactions();
    console.log("Transaction cleanup completed successfully.");
  } catch (error) {
    console.error("Error during transaction cleanup:", error);
  }
});
