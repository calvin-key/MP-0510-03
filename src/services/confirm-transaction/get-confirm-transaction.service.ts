import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import { prisma } from "../../lib/prisma";

interface GetTransactionsQuery extends PaginationQueryParams {
  search: string;
}

export const getTransactionsByOrganizerIdService = async (
  userId: number,
  query: GetTransactionsQuery
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }
    if (user.role !== "ORGANIZER") {
      throw new Error("You are not an organizer");
    }

    const { page, sortBy, sortOrder, take, search } = query;

    // Find all events by this organizer
    const organizerEvents = await prisma.event.findMany({
      where: { userId: userId },
      select: { id: true },
    });

    const eventIds = organizerEvents.map((event) => event.id);

    const whereClause: Prisma.TransactionWhereInput = {
      items: {
        some: {
          ticketType: {
            event: {
              userId: userId,
            },
          },
        },
      },
    };

    if (search) {
      whereClause.OR = [
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        items: {
          include: {
            ticketType: {
              include: {
                event: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        voucher: true,
      },
    });

    const count = await prisma.transaction.count({ where: whereClause });

    return {
      data: transactions,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
