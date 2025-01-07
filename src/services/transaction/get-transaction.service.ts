import { prisma } from "../../lib/prisma";

export const getTransactionService = async (id: number) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id },
      include: {
        items: {
          include: {
            ticketType: {
              include: {
                event: {
                  include: {
                    organizer: {
                      select: {
                        fullName: true,
                        bankAccount: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new Error("Invalid transaction ID");
    }

    return transaction;
  } catch (error) {
    throw error;
  }
};
