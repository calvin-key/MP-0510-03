import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import { prisma } from "../../lib/prisma";

interface GetEventsQuery extends PaginationQueryParams {
  search?: string;
  city?: string;
  category?: string;
}

export const getEventsService = async (query: GetEventsQuery) => {
  try {
    const { page, sortBy, sortOrder, take, search, city, category } = query;

    const whereClause: Prisma.EventWhereInput = {
      isDeleted: false,
      endDate: { gte: new Date() },
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { organizer: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (city) {
      whereClause.location = { city: { equals: city, mode: "insensitive" } };
    }

    if (category) {
      whereClause.eventCategories = {
        some: { category: { name: { equals: category, mode: "insensitive" } } },
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        organizer: { select: { fullName: true } },
        eventCategories: { select: { category: { select: { name: true } } } },
        ticketTypes: { select: { price: true } },
      },
    });

    const eventsWithLowestPrice = events.map((event) => ({
      ...event,
      lowestPrice: event.ticketTypes.reduce(
        (minPrice, ticket) => Math.min(minPrice, ticket.price),
        Infinity
      ),
    }));

    const count = await prisma.event.count({ where: whereClause });

    return {
      data: eventsWithLowestPrice,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
