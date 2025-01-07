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
exports.createVoucherService = void 0;
const prisma_1 = require("../../lib/prisma");
const createVoucherService = (organizerId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, code, description, nominal, quantity, startAt, expiresAt } = data;
    const event = yield prisma_1.prisma.event.findFirst({
        where: {
            id: Number(eventId),
            userId: organizerId,
            isDeleted: false,
            startDate: { gte: new Date() },
        },
    });
    if (!event) {
        throw new Error("Unauthorized to create voucher for this event.");
    }
    return prisma_1.prisma.voucher.create({
        data: {
            code,
            description,
            nominal,
            quantity,
            startAt: new Date(startAt),
            expiresAt: new Date(expiresAt),
            eventId: Number(eventId),
        },
    });
});
exports.createVoucherService = createVoucherService;
