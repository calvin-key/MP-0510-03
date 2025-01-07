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
exports.getTransactionStatisticsService = void 0;
const prisma_1 = require("../../lib/prisma");
const getTransactionStatisticsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, // This is now the organizerId
year, month, day, }) {
    try {
        const filters = {
            status: "done",
            items: {
                some: {
                    ticketType: {
                        event: {
                            userId: userId, // Filter for events where user is the organizer
                        },
                    },
                },
            },
        };
        if (year) {
            filters.createdAt = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${Number(year) + 1}-01-01`),
            };
        }
        if (month) {
            filters.createdAt = {
                gte: new Date(`${year}-${month}-01`),
                lt: month === "12"
                    ? new Date(`${Number(year) + 1}-01-01`)
                    : new Date(`${year}-${Number(month) + 1}-01`),
            };
        }
        if (day) {
            filters.createdAt = {
                gte: new Date(`${year}-${month}-${day}`),
                lt: new Date(`${year}-${month}-${Number(day) + 1}`),
            };
        }
        // Get transactions for the organizer's events
        const transactions = yield prisma_1.prisma.transaction.findMany({
            where: filters,
            include: {
                items: {
                    include: {
                        ticketType: {
                            include: {
                                event: {
                                    select: { name: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        // Process the data to get statistics
        const statistics = transactions.reduce((acc, transaction) => {
            transaction.items.forEach((item) => {
                const existingEntry = acc.find((entry) => entry.ticketTypeId === item.ticketTypeId);
                if (existingEntry) {
                    existingEntry.totalTransactions += item.quantity;
                    existingEntry.totalRevenue += item.subtotal;
                }
                else {
                    acc.push({
                        ticketTypeId: item.ticketTypeId,
                        eventName: item.ticketType.event.name,
                        ticketType: item.ticketType.ticketType,
                        totalTransactions: item.quantity,
                        totalRevenue: item.subtotal,
                    });
                }
            });
            return acc;
        }, []);
        return statistics;
    }
    catch (error) {
        console.error("Error in getTransactionStatisticsService:", error);
        throw error;
    }
});
exports.getTransactionStatisticsService = getTransactionStatisticsService;
