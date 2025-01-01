import { prisma } from "../../lib/prisma";

export const getUserService = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    throw error;
  }
};
