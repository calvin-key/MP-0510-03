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
exports.getUserTransactionsService = void 0;
const prisma_1 = require("../../lib/prisma");
const getUserTransactionsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma_1.prisma.transaction.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        ticketType: {
                            include: {
                                event: { include: { location: true } },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return transactions;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserTransactionsService = getUserTransactionsService;
