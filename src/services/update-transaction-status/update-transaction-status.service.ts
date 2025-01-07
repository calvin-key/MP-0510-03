import { TransactionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const updateTransactionStatusService = async (
  transactionId: number,
  status: TransactionStatus,
  notes?: string
) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        confirmedAt: status === "done" ? new Date() : null,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        TicketType: {
          select: {
            event: {
              select: {
                name: true,
              },
            },
            ticketType: true,
            price: true,
          },
        },
        voucher: {
          select: {
            nominal: true,
          },
        },
        coupon: {
          select: {
            nominal: true,
          },
        },
        items: {
          select: {
            quantity: true,
            pricePerUnit: true,
            subtotal: true,
          },
        },
      },
    });

    return transaction;
  } catch (error) {
    throw error;
  }
};
