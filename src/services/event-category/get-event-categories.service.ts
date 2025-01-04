import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetEventCategoriesQuery {
  search?: string;
}

export const getEventCategoriesService = async (
  query: GetEventCategoriesQuery
) => {
  try {
    const { search } = query;

    const whereClause: Prisma.CategoryWhereInput = {};

    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const eventCategories = await prisma.category.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
    });

    const count = await prisma.category.count({ where: whereClause });

    return {
      data: eventCategories,
      meta: { total: count },
    };
  } catch (error) {
    throw error;
  }
};
