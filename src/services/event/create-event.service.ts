import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface CreateEventBody {
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

export const createEventService = async (
  body: CreateEventBody,
  image: Express.Multer.File,
  userId: number
) => {
  try {
    const { name, city, categories, ticketTypes } = body;

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const event = await prisma.event.findFirst({
      where: { name, isDeleted: false },
    });

    if (event) {
      throw new Error("Event with this name already exists.");
    }

    const now = new Date();
    if (startDate < now && endDate < now) {
      throw new Error("Event can't be held in the past");
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

    const newEvent = await prisma.event.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        specificLocation: body.specificLocation,
        startDate,
        endDate,
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
  } catch (error) {
    throw error;
  }
};
