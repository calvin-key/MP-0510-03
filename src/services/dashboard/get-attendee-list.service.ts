// src/services/attendee/get-attendee-list.service.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetAttendeeListParams {
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  eventId?: number;
  search?: string;
}

export const getAttendeeListService = async (
  query: GetAttendeeListParams,
  organizerId: number
) => {
  try {
    // 1. Set nilai default untuk parameter
    const page = query.page || 1;
    const take = query.take || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    // 2. Buat kondisi pencarian untuk event dengan tipe yang benar
    const eventWhereClause: Prisma.EventWhereInput = {
      AND: [
        { userId: organizerId },
        { isDeleted: false },
        query.eventId ? { id: query.eventId } : {},
        query.search
          ? {
              name: {
                contains: query.search,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
      ],
    };

    // 3. Ambil data ticketTypes beserta event yang terkait
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        event: eventWhereClause,
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            name: true,
            startDate: true,
            endDate: true,
            description: true,
          },
        },
      },
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // 4. Hitung total records untuk pagination
    const totalCount = await prisma.ticketType.count({
      where: {
        event: eventWhereClause,
        isDeleted: false,
      },
    });

    // 5. Format data untuk response
    const formattedData = ticketTypes.map((ticket) => ({
      id: ticket.id,
      eventName: ticket.event.name,
      eventDescription: ticket.event.description,
      ticketType: ticket.ticketType,
      price: ticket.price,
      availableSeats: ticket.availableSeats,
      revenue: ticket.price * ticket.availableSeats,
      eventStartDate: ticket.event.startDate,
      eventEndDate: ticket.event.endDate,
    }));

    // 6. Return data dengan format yang sesuai
    return {
      data: formattedData,
      meta: {
        page,
        take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    console.error("Error in getAttendeeListService:", error);
    throw new Error("Failed to fetch attendee list");
  }
};
