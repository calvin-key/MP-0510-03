import { prisma } from "../../lib/prisma";

export const getUserService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { password: pass, ...userWithoutPassword } = user;

    return { ...userWithoutPassword };
  } catch (error) {
    throw error;
  }
};
