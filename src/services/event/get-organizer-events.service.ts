import { prisma } from "../../lib/prisma";

export const getOrganizerEventsService = async (organizerId: number) => {
  try {
    const now = new Date()
    const events = await prisma.event.findMany({
      where: {
        organizer: { id: organizerId },
        isDeleted: false,
        endDate: { gte: now },
      },
    });

    if (!events) {
      throw new Error("no events found for this organizer");
    }

    return events;
  } catch (error) {
    throw error;
  }
};
