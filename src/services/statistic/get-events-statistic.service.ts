import { prisma } from "../../lib/prisma";

interface EventStatisticsParams {
  userId: number;
  year?: string;
  month?: string;
  day?: string;
}

export const getEventsStatisticsService = async ({
  userId,
  year,
  month,
  day,
}: EventStatisticsParams) => {
  try {
    // First get all events for this user
    const userEvents = await prisma.event.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: { id: true },
    });

    const eventIds = userEvents.map((event) => event.id);

    const filters: any = {
      AND: [
        {
          TicketType: {
            eventId: {
              in: eventIds,
            },
          },
        },
        { status: "done" },
      ],
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
            : new Date(
                `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`
              ),
      };
    }
    if (day) {
      filters.createdAt = {
        gte: new Date(`${year}-${month}-${day}`),
        lt: new Date(
          `${year}-${month}-${String(Number(day) + 1).padStart(2, "0")}`
        ),
      };
    }

    const statistics = await prisma.transaction.groupBy({
      by: ["ticketTypeId"],
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
      where: filters,
    });

    // Get ticket types with their events
    const ticketTypesWithEvents = await prisma.ticketType.findMany({
      where: {
        id: {
          in: statistics
            .map((stat) => stat.ticketTypeId)
            .filter((id): id is number => id !== null),
        },
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
          },
        },
      },
    });

    const formattedStatistics = ticketTypesWithEvents.map((ticketType) => {
      const stat = statistics.find((s) => s.ticketTypeId === ticketType.id);
      return {
        eventId: ticketType.event.id,
        eventName: ticketType.event.name,
        startDate: ticketType.event.startDate,
        ticketType: ticketType.ticketType,
        totalTransactions: stat?._count.id || 0,
        totalRevenue: stat?._sum.totalPrice || 0,
      };
    });

    return formattedStatistics;
  } catch (error) {
    throw error;
  }
};
