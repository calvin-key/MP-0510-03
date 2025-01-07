"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
const node_cron_1 = __importDefault(require("node-cron"));
const checkExpiredTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    // Get transactions that need to be expired/canceled
    const expiredTransactions = yield prisma_1.prisma.transaction.findMany({
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
    const canceledTransactions = yield prisma_1.prisma.transaction.findMany({
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
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Restore points if used
            if (transaction.pointsUsed > 0) {
                yield tx.user.update({
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
                yield tx.voucher.update({
                    where: { id: transaction.voucherId },
                    data: {
                        usageCount: {
                            decrement: 1,
                        },
                    },
                });
                yield tx.voucherUsage.delete({
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
                yield tx.userCoupon.updateMany({
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
                yield tx.ticketType.update({
                    where: { id: item.ticketTypeId },
                    data: {
                        availableSeats: {
                            increment: item.quantity,
                        },
                    },
                });
            }
            // 5. Update transaction status
            yield tx.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: transaction.status === "waiting_for_payment"
                        ? "expired"
                        : "canceled",
                },
            });
        }));
    }
});
node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running transaction cleanup cron job...");
    try {
        yield checkExpiredTransactions();
        console.log("Transaction cleanup completed successfully.");
    }
    catch (error) {
        console.error("Error during transaction cleanup:", error);
    }
}));
