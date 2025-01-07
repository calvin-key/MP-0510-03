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
exports.updateTransactionStatusService = void 0;
const prisma_1 = require("../../lib/prisma");
const updateTransactionStatusService = (transactionId, status, notes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.prisma.transaction.update({
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
    }
    catch (error) {
        throw error;
    }
});
exports.updateTransactionStatusService = updateTransactionStatusService;
