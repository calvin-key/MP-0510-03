import { prisma } from "../../lib/prisma";

export const createReviewService = async (
  userId: number,
  eventId: number,
  rating: number,
  comment: string
) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const now = new Date();
    if (now <= event.endDate) {
      throw new Error("You can only review events that have ended");
    }

    const hasTicket = await prisma.transaction.findFirst({
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

    const review = await prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment,
      },
    });

    return review;
  } catch (error) {
    throw error;
  }
};
