import { prisma } from "../../lib/prisma";

interface CreateEventCategoryBody {
  name: string;
  description: string;
}

export const createEventCategoryService = async (
  body: CreateEventCategoryBody
) => {
  try {
    const { name, description } = body;

    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      throw new Error("Category with the same title already exists.");
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return category;
  } catch (error) {
    throw error;
  }
};
