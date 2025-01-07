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
exports.editEventService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
const editEventService = (body, image, userId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, address, specificLocation, locationId, startDate, endDate, eventCategories, ticketTypes, } = body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date values provided.");
        }
        const event = yield prisma_1.prisma.event.findFirst({
            where: {
                id: eventId,
                isDeleted: false,
            },
        });
        if (!event) {
            throw new Error("Event not found");
        }
        if (event.userId !== userId) {
            throw new Error("You are not authorized to edit this event");
        }
        const existingEvent = yield prisma_1.prisma.event.findFirst({
            where: {
                id: { not: eventId },
                name: name,
                isDeleted: false,
            },
        });
        if (existingEvent) {
            throw new Error("Event with the same name already exists.");
        }
        // Handle image upload
        let imageUrl;
        if (image) {
            if (event.image) {
                yield (0, cloudinary_1.cloudinaryRemove)(event.image);
            }
            const uploadResult = yield (0, cloudinary_1.cloudinaryUpload)(image);
            imageUrl = uploadResult.secure_url;
        }
        // Update event using transaction to handle related records
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Update main event details
            yield tx.event.update({
                where: { id: eventId },
                data: Object.assign({ name,
                    description,
                    address,
                    specificLocation,
                    locationId, startDate: start, endDate: end }, (imageUrl && { image: imageUrl })),
            });
            // Update event categories
            yield tx.eventCategory.deleteMany({
                where: { eventId },
            });
            yield tx.eventCategory.createMany({
                data: eventCategories.map((categoryId) => ({
                    eventId,
                    categoryId,
                })),
            });
            // Update ticket types
            yield tx.ticketType.deleteMany({
                where: { eventId },
            });
            yield tx.ticketType.createMany({
                data: ticketTypes.map((ticket) => ({
                    eventId,
                    ticketType: ticket.ticketType,
                    price: ticket.price,
                    availableSeats: ticket.availableSeats,
                })),
            });
        }));
        return { message: "Event updated successfully" };
    }
    catch (error) {
        throw error;
    }
});
exports.editEventService = editEventService;
