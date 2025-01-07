import { prisma } from "../../lib/prisma";

export const getOrganizerService = async (organizerId: number) => {
  try {
    const currentDate = new Date();

    // Fetch the organizer data
    const organizer = await prisma.user.findFirst({
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
    const reviews = await prisma.review.findMany({
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
    const averageRating =
      reviews.length > 0
        ? parseFloat(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          )
        : 0;

    return {
      ...organizer,
      reviews,
      averageRating,
      totalEvents: organizer.events.length,
      totalReviews: reviews.length,
    };
  } catch (error) {
    throw error;
  }
};
