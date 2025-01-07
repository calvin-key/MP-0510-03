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
exports.createReviewService = void 0;
const prisma_1 = require("../../lib/prisma");
const createReviewService = (userId, eventId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event) {
            throw new Error("Event not found");
        }
        const now = new Date();
        if (now <= event.endDate) {
            throw new Error("You can only review events that have ended");
        }
        const hasTicket = yield prisma_1.prisma.transaction.findFirst({
            where: {
                userId,
                status: "done",
                TicketType: {
                    eventId,
                },
            },
        });
        if (!hasTicket) {
            throw new Error("You can only review events you have tickets for");
        }
        const review = yield prisma_1.prisma.review.create({
            data: {
                userId,
                eventId,
                rating,
                comment,
            },
        });
        return review;
    }
    catch (error) {
        throw error;
    }
});
exports.createReviewService = createReviewService;
