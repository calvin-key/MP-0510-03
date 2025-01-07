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
exports.getTransactionsByOrganizerIdService = void 0;
const prisma_1 = require("../../lib/prisma");
const getTransactionsByOrganizerIdService = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("Invalid user id");
        }
        if (user.role !== "ORGANIZER") {
            throw new Error("You are not an organizer");
        }
        const { page = 1, sortBy = "createdAt", sortOrder = "desc", take = 10, search, } = query;
        // Find all events for this organizer
        const organizerEvents = yield prisma_1.prisma.event.findMany({
            where: {
                userId,
                isDeleted: false,
            },
            select: { id: true },
        });
        const eventIds = organizerEvents.map((event) => event.id);
        // Updated whereClause to use TransactionItems
        const whereClause = {
            items: {
                some: {
                    ticketType: {
                        event: {
                            id: {
                                in: eventIds,
                            },
                        },
                    },
                },
            },
        };
        if (search) {
            whereClause.OR = [
                { user: { email: { contains: search, mode: "insensitive" } } },
                {
                    items: {
                        some: {
                            ticketType: {
                                event: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    },
                },
            ];
        }
        const transactions = yield prisma_1.prisma.transaction.findMany({
            where: whereClause,
            skip: (page - 1) * take,
            take: take,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        ticketType: {
                            include: {
                                event: {
                                    select: {
                                        name: true,
                                        userId: true,
                                    },
                                },
                            },
                        },
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
            },
        });
        const count = yield prisma_1.prisma.transaction.count({ where: whereClause });
        // Transform the data to match your expected format
        const transformedTransactions = transactions.map((transaction) => {
            var _a;
            return (Object.assign(Object.assign({}, transaction), { TicketType: ((_a = transaction.items[0]) === null || _a === void 0 ? void 0 : _a.ticketType) || null, items: transaction.items.map((item) => ({
                    quantity: item.quantity,
                    pricePerUnit: item.pricePerUnit,
                    subtotal: item.subtotal,
                })) }));
        });
        return {
            data: transformedTransactions,
            meta: {
                page,
                take,
                total: count,
            },
        };
    }
    catch (error) {
        console.error("Error in getTransactionsByOrganizerIdService:", error);
        throw error;
    }
});
exports.getTransactionsByOrganizerIdService = getTransactionsByOrganizerIdService;
