import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

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
  startDate: string;
  endDate: string;
  city: string;
  categories: string[];
  ticketTypes: { ticketType: string; price: number; availableSeats: number }[];
}

export const editEventService = async (
  body: EditEventBody,
  image: Express.Multer.File,
  userId: number,
  eventId: number
) => {
  console.log(body);

  try {
    const { name, city, categories, ticketTypes } = body;

    const existingEvent = await prisma.event.findFirst({
      where: { id: { not: eventId }, name: name, isDeleted: false },
    });

    if (existingEvent && existingEvent.name === name) {
      throw new Error("Event with the same name already exists.");
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, isDeleted: false },
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    const location = await prisma.location.findFirst({
      where: { city, isDeleted: false },
    });

    if (!location) {
      throw new Error(`Location with city "${city}" not found.`);
    }

    const { secure_url } = await cloudinaryUpload(image);

    const categoryRecords = await prisma.category.findMany({
      where: {
        name: {
          in: categories,
        },
      },
    });

    if (categoryRecords.length !== categories.length) {
      throw new Error("One or more categories are invalid.");
    }

    const newEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        specificLocation: body.specificLocation,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        image: secure_url,
        userId,
        locationId: location.id,
        ticketTypes: {
          deleteMany: {},
          create: ticketTypes,
        },
        eventCategories: {
          deleteMany: {},
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
  } catch (error) {
    throw error;
  }
};
