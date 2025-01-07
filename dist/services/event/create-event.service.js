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
exports.createEventService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
const createEventService = (body, image, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, city, categories, ticketTypes } = body;
<<<<<<< HEAD
=======
        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);
>>>>>>> main
        const event = yield prisma_1.prisma.event.findFirst({
            where: { name, isDeleted: false },
        });
        if (event) {
            throw new Error("Event with this name already exists.");
        }
<<<<<<< HEAD
=======
        const now = new Date();
        if (startDate < now && endDate < now) {
            throw new Error("Event can't be held in the past");
        }
>>>>>>> main
        const location = yield prisma_1.prisma.location.findFirst({
            where: { city, isDeleted: false },
        });
        if (!location) {
            throw new Error(`Location with city "${city}" not found.`);
        }
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(image);
        const categoryRecords = yield prisma_1.prisma.category.findMany({
            where: {
                name: {
                    in: categories,
                },
            },
        });
        if (categoryRecords.length !== categories.length) {
            throw new Error("One or more categories are invalid.");
        }
        const newEvent = yield prisma_1.prisma.event.create({
            data: {
                name: body.name,
                description: body.description,
                address: body.address,
                specificLocation: body.specificLocation,
<<<<<<< HEAD
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
=======
                startDate,
                endDate,
>>>>>>> main
                image: secure_url,
                userId,
                locationId: location.id,
                ticketTypes: {
                    create: ticketTypes,
                },
                eventCategories: {
                    create: categoryRecords.map((category) => ({
                        categoryId: category.id,
                    })),
                },
            },
            include: {
                ticketTypes: true,
                eventCategories: true,
            },
        });
        return newEvent;
    }
    catch (error) {
        throw error;
    }
});
exports.createEventService = createEventService;
