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
exports.getEventsService = void 0;
const prisma_1 = require("../../lib/prisma");
const getEventsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, sortBy, sortOrder, take, search, city, category } = query;
        const whereClause = {
            isDeleted: false,
            endDate: { gte: new Date() },
        };
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { organizer: { fullName: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (city) {
            whereClause.location = { city: { equals: city, mode: "insensitive" } };
        }
        if (category) {
            whereClause.eventCategories = {
                some: { category: { name: { equals: category, mode: "insensitive" } } },
            };
        }
        const events = yield prisma_1.prisma.event.findMany({
            where: whereClause,
            skip: (page - 1) * take,
            take,
            orderBy: { [sortBy]: sortOrder },
            include: {
                organizer: { select: { fullName: true } },
                eventCategories: { select: { category: { select: { name: true } } } },
                ticketTypes: { select: { price: true } },
            },
        });
        const eventsWithLowestPrice = events.map((event) => (Object.assign(Object.assign({}, event), { lowestPrice: event.ticketTypes.reduce((minPrice, ticket) => Math.min(minPrice, ticket.price), Infinity) })));
        const count = yield prisma_1.prisma.event.count({ where: whereClause });
        return {
            data: eventsWithLowestPrice,
            meta: { page, take, total: count },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getEventsService = getEventsService;
