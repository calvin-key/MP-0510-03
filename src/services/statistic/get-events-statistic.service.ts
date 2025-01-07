import { prisma } from "../../lib/prisma";

interface TransactionStatisticsParams {
  userId: number;
  year?: string;
  month?: string;
  day?: string;
}

export const getTransactionStatisticsService = async ({
  userId, // This is now the organizerId
  year,
  month,
  day,
}: TransactionStatisticsParams) => {
  try {
    const filters: any = {
      status: "done",
      items: {
        some: {
          ticketType: {
            event: {
              userId: userId, // Filter for events where user is the organizer
            },
          },
        },
      },
    };

    if (year) {
      filters.createdAt = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`),
      };
    }

    if (month) {
      filters.createdAt = {
        gte: new Date(`${year}-${month}-01`),
        lt:
          month === "12"
            ? new Date(`${Number(year) + 1}-01-01`)
            : new Date(`${year}-${Number(month) + 1}-01`),
      };
    }

    if (day) {
      filters.createdAt = {
        gte: new Date(`${year}-${month}-${day}`),
        lt: new Date(`${year}-${month}-${Number(day) + 1}`),
      };
    }

    // Get transactions for the organizer's events
    const transactions = await prisma.transaction.findMany({
      where: filters,
      include: {
        items: {
          include: {
            ticketType: {
              include: {
                event: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // Process the data to get statistics
    const statistics = transactions.reduce((acc: any[], transaction) => {
      transaction.items.forEach((item) => {
        const existingEntry = acc.find(
          (entry) => entry.ticketTypeId === item.ticketTypeId
        );

        if (existingEntry) {
          existingEntry.totalTransactions += item.quantity;
          existingEntry.totalRevenue += item.subtotal;
        } else {
          acc.push({
            ticketTypeId: item.ticketTypeId,
            eventName: item.ticketType.event.name,
            ticketType: item.ticketType.ticketType,
            totalTransactions: item.quantity,
            totalRevenue: item.subtotal,
          });
        }
      });

      return acc;
    }, []);

    return statistics;
  } catch (error) {
    console.error("Error in getTransactionStatisticsService:", error);
    throw error;
  }
};
