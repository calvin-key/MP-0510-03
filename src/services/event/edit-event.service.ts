// First, let's define the necessary types
interface TicketType {
  ticketType: string;
  price: number;
  availableSeats: number;
}

interface EditEventBody {
  name: string;
  description: string;
  address: string;
  specificLocation: string;
  locationId: number;
  startDate: string;
  endDate: string;
  eventCategories: number[];
  ticketTypes: TicketType[];
}

import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

export const editEventService = async (
  body: EditEventBody,
  image: Express.Multer.File | undefined,
  userId: number,
  eventId: number
) => {
  try {
    const {
      name,
      description,
      address,
      specificLocation,
      locationId,
      startDate,
      endDate,
      eventCategories,
      ticketTypes,
    } = body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date values provided.");
    }

    const event = await prisma.event.findFirst({
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

    const existingEvent = await prisma.event.findFirst({
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
    let imageUrl: string | undefined;
    if (image) {
      if (event.image) {
        await cloudinaryRemove(event.image);
      }
      const uploadResult = await cloudinaryUpload(image);
      imageUrl = uploadResult.secure_url;
    }

    // Update event using transaction to handle related records
    await prisma.$transaction(async (tx) => {
      // Update main event details
      await tx.event.update({
        where: { id: eventId },
        data: {
          name,
          description,
          address,
          specificLocation,
          locationId,
          startDate: start,
          endDate: end,
          ...(imageUrl && { image: imageUrl }),
        },
      });

      // Update event categories
      await tx.eventCategory.deleteMany({
        where: { eventId },
      });

      await tx.eventCategory.createMany({
        data: eventCategories.map((categoryId: number) => ({
          eventId,
          categoryId,
        })),
      });

      // Update ticket types
      await tx.ticketType.deleteMany({
        where: { eventId },
      });

      await tx.ticketType.createMany({
        data: ticketTypes.map((ticket: TicketType) => ({
          eventId,
          ticketType: ticket.ticketType,
          price: ticket.price,
          availableSeats: ticket.availableSeats,
        })),
      });
    });

    return { message: "Event updated successfully" };
  } catch (error) {
    throw error;
  }
};
