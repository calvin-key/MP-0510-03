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
exports.getOrganizerService = void 0;
const prisma_1 = require("../../lib/prisma");
const getOrganizerService = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        // Fetch the organizer data
        const organizer = yield prisma_1.prisma.user.findFirst({
            where: {
                id: organizerId,
                role: "ORGANIZER",
                isDeleted: false,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                profilePicture: true,
                address: true,
                createdAt: true,
                // Upcoming events
                events: {
                    where: {
                        isDeleted: false,
                        endDate: {
                            gte: currentDate,
                        },
                    },
                    include: {
                        location: {
                            select: {
                                country: true,
                                city: true,
                            },
                        },
                        eventCategories: {
                            include: {
                                category: {
                                    select: {
                                        name: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                        ticketTypes: {
                            where: {
                                isDeleted: false,
                            },
                            select: {
                                ticketType: true,
                                price: true,
                                availableSeats: true,
                            },
                        },
                    },
                    orderBy: {
                        startDate: "asc",
                    },
                },
            },
        });
        if (!organizer) {
            throw new Error("Organizer not found");
        }
        // Fetch reviews from ended events organized by this organizer
        const reviews = yield prisma_1.prisma.review.findMany({
            where: {
                event: {
                    userId: organizerId,
                    endDate: {
                        lt: currentDate,
                    },
                    isDeleted: false,
                },
            },
            select: {
                rating: true,
                comment: true,
                createdAt: true,
                event: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // Calculate average rating from reviews
        const averageRating = reviews.length > 0
            ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length).toFixed(1))
            : 0;
        return Object.assign(Object.assign({}, organizer), { reviews,
            averageRating, totalEvents: organizer.events.length, totalReviews: reviews.length });
    }
    catch (error) {
        throw error;
    }
});
exports.getOrganizerService = getOrganizerService;
