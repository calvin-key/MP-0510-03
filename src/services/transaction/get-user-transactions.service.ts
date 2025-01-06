import { prisma } from "../../lib/prisma";

export const getUserTransactionsService = async (userId: number) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            ticketType: {
              include: {
                event: { include: { location: true } },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions;
  } catch (error) {
    throw error;
  }
};
