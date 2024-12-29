import { prisma } from "../../lib/prisma";

export const getEventService = async (id: number) => {
  try {
    const event = await prisma.event.findFirst({
      where: { id, isDeleted: false },
      include: {
        organizer: {
          select: { id: true, fullName: true, profilePicture: true },
        },
        location: { select: { city: true } },
        eventCategories: { select: { category: { select: { name: true } } } },
        ticketTypes: { select: { ticketType: true, price: true } },
      },
    });

    if (!event) {
      throw new Error("Invalid event ID");
    }

    return event;
  } catch (error) {
    throw error;
  }
};
