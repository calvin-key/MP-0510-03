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
exports.getOrganizerEventsService = void 0;
const prisma_1 = require("../../lib/prisma");
const getOrganizerEventsService = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.prisma.event.findMany({
            where: {
                organizer: { id: organizerId },
                isDeleted: false,
                endDate: { gte: new Date() },
            },
        });
        if (!events) {
            throw new Error("no events found for this organizer");
        }
        return events;
    }
    catch (error) {
        throw error;
    }
});
exports.getOrganizerEventsService = getOrganizerEventsService;
