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
exports.getAttendeesByEventService = void 0;
const prisma_1 = require("../../lib/prisma");
const getAttendeesByEventService = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendees = yield prisma_1.prisma.transaction.findMany({
            where: {
                status: "done",
                items: {
                    some: {
                        ticketType: {
                            eventId: eventId,
                        },
                    },
                },
            },
            select: {
                id: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                items: {
                    select: {
                        quantity: true,
                        pricePerUnit: true,
                    },
                },
                totalPrice: true,
            },
        });
        return attendees.map((attendee) => ({
            name: attendee.user.fullName,
            email: attendee.user.email,
            ticketCount: attendee.items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: attendee.totalPrice,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.getAttendeesByEventService = getAttendeesByEventService;
