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

    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
      search,
    } = query;

    // Find all events for this organizer
    const organizerEvents = await prisma.event.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: { id: true },
    });

    const eventIds = organizerEvents.map((event) => event.id);

    // Updated whereClause to use TransactionItems
    const whereClause: Prisma.TransactionWhereInput = {
      items: {
        some: {
          ticketType: {
            event: {
              id: {
                in: eventIds,
              },
            },
          },
        },
      },
    };

    if (search) {
      whereClause.OR = [
        { user: { email: { contains: search, mode: "insensitive" } } },
        {
          items: {
            some: {
              ticketType: {
                event: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
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
                    userId: true,
                  },
                },
              },
            },
          },
        },
        voucher: {
          select: {
            nominal: true,
          },
        },
        coupon: {
          select: {
            nominal: true,
          },
        },
      },
    });

    const count = await prisma.transaction.count({ where: whereClause });

    // Transform the data to match your expected format
    const transformedTransactions = transactions.map((transaction) => ({
      ...transaction,
      TicketType: transaction.items[0]?.ticketType || null, // Take the first ticket type if exists
      items: transaction.items.map((item) => ({
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        subtotal: item.subtotal,
      })),
    }));

    return {
      data: transformedTransactions,
      meta: {
        page,
        take,
        total: count,
      },
    };
  } catch (error) {
    console.error("Error in getTransactionsByOrganizerIdService:", error);
    throw error;
  }
};
