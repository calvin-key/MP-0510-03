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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionService = void 0;
const prisma_1 = require("../../lib/prisma");
const createTransactionService = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tickets, pointsUsed = 0, voucherId, couponId } = body;
        return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const ticketTypes = yield Promise.all(tickets.map((ticket) => __awaiter(void 0, void 0, void 0, function* () {
                const ticketType = yield tx.ticketType.findUnique({
                    where: { id: ticket.ticketTypeId },
                    include: { event: true },
                });
                if (!ticketType) {
                    throw new Error(`Ticket type ${ticket.ticketTypeId} not found.`);
                }
                if (ticketType.availableSeats < ticket.quantity) {
                    throw new Error(`Not enough seats available for ticket type ${ticket.ticketTypeId}`);
                }
                return Object.assign(Object.assign({}, ticketType), { requestedQuantity: ticket.quantity });
            })));
            const totalBasePrice = ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.requestedQuantity, 0);
            let voucherDiscount = 0;
            if (voucherId) {
                const voucher = yield tx.voucher.findUnique({
                    where: { id: voucherId },
                    include: { event: true },
                });
                if (!voucher) {
                    throw new Error("Voucher not found.");
                }
                if (voucher.expiresAt < new Date()) {
                    throw new Error("Voucher has expired.");
                }
                if (voucher.usageCount >= voucher.quantity) {
                    throw new Error("Voucher usage limit reached.");
                }
                const existingUsage = yield tx.voucherUsage.findUnique({
                    where: {
                        userId_voucherId: {
                            userId: userId,
                            voucherId: voucherId,
                        },
                    },
                });
                if (existingUsage) {
                    throw new Error("You have already used this voucher.");
                }
                // Verify voucher is valid for any of the selected tickets' events
                const validForEvent = ticketTypes.some((ticket) => ticket.event.id === voucher.event.id);
                if (!validForEvent) {
                    throw new Error("Voucher is not valid for any of the selected events.");
                }
                voucherDiscount = voucher.nominal;
                yield tx.voucher.update({
                    where: { id: voucherId },
                    data: { usageCount: { increment: 1 } },
                });
                yield tx.voucherUsage.create({
                    data: {
                        userId,
                        voucherId,
                    },
                });
            }
            let couponDiscount = 0;
            if (couponId) {
                const userCoupon = yield tx.userCoupon.findFirst({
                    where: {
                        userId,
                        couponId,
                        isUsed: false,
                    },
                    include: {
                        coupon: true,
                    },
                });
                if (!userCoupon) {
                    throw new Error("Coupon not found or already used.");
                }
                if (userCoupon.coupon.expiredAt < new Date()) {
                    throw new Error("Coupon has expired.");
                }
                couponDiscount = userCoupon.coupon.nominal;
                yield tx.userCoupon.update({
                    where: { id: userCoupon.id },
                    data: { isUsed: true },
                });
            }
            if (pointsUsed > 0) {
                const user = yield tx.user.findUnique({
                    where: { id: userId },
                    select: { pointsBalance: true },
                });
                if (!user || user.pointsBalance < pointsUsed) {
                    throw new Error("Insufficient points balance.");
                }
                yield tx.user.update({
                    where: { id: userId },
                    data: { pointsBalance: { decrement: pointsUsed } },
                });
            }
            const totalDiscount = pointsUsed + voucherDiscount + couponDiscount;
            const finalTotalPrice = Math.max(0, totalBasePrice - totalDiscount);
            const transaction = yield tx.transaction.create({
                data: {
                    userId,
                    pointsUsed,
                    voucherId,
                    couponId,
                    totalPrice: finalTotalPrice,
                    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2-hour expiration
                    items: {
                        create: ticketTypes.map((ticket) => ({
                            ticketTypeId: ticket.id,
                            quantity: ticket.requestedQuantity,
                            pricePerUnit: ticket.price,
                            subtotal: ticket.price * ticket.requestedQuantity,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            yield Promise.all(ticketTypes.map((ticket) => tx.ticketType.update({
                where: { id: ticket.id },
                data: { availableSeats: { decrement: ticket.requestedQuantity } },
            })));
            return transaction;
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.createTransactionService = createTransactionService;
