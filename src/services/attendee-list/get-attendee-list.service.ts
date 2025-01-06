import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetAttendeeListService {
  page: number;
  take: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  eventId: number;
  search?: string;
}

export const getAttendeeListService = async (query: GetAttendeeListService) => {
  try {
    const { take, page, sortBy, sortOrder, eventId, search } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      status: "done",
      items: {
        some: {
          ticketType: {
            eventId: eventId,
          },
        },
      },
    };

    if (search) {
      whereClause.user = {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const attendeeList = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            ticketType: {
              select: {
                ticketType: true,
                price: true,
              },
            },
          },
        },
      },
    });

    const count = await prisma.transaction.count({
      where: whereClause,
    });

    const formattedAttendeeList = attendeeList.map((attendee) => ({
      id: attendee.id,
      name: attendee.user.fullName,
      email: attendee.user.email,
      ticketDetails: attendee.items.map((item) => ({
        type: item.ticketType.ticketType,
        quantity: item.quantity,
        pricePerUnit: item.ticketType.price,
      })),
      totalQuantity: attendee.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      totalPrice: attendee.totalPrice,
      purchaseDate: attendee.createdAt,
    }));

    return {
      data: formattedAttendeeList,
      meta: {
        page,
        take,
        total: count,
        totalPages: Math.ceil(count / take),
      },
    };
  } catch (error) {
    throw error;
  }
};
