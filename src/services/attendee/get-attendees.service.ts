import { prisma } from "../../lib/prisma";
import { TransactionStatus } from "@prisma/client";

export const getAttendeesByEventService = async (eventId: number) => {
  try {
    const attendees = await prisma.transaction.findMany({
      where: {
        status: "done" as TransactionStatus,
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
  } catch (error) {
    throw error;
  }
};
