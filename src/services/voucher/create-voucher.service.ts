import { prisma } from "../../lib/prisma";

interface CreateVoucherBody {
  eventId: number;
  code: string;
  description: string;
  nominal: number;
  quantity: number;
  startAt: string;
  expiresAt: string;
}

export const createVoucherService = async (
  organizerId: number,
  data: CreateVoucherBody
) => {
  const { eventId, code, description, nominal, quantity, startAt, expiresAt } =
    data;

  const event = await prisma.event.findFirst({
    where: {
      id: Number(eventId),
      userId: organizerId,
      isDeleted: false,
      startDate: { gte: new Date() },
    },
  });

  if (!event) {
    throw new Error("Unauthorized to create voucher for this event.");
  }

  return prisma.voucher.create({
    data: {
      code,
      description,
      nominal,
      quantity,
      startAt: new Date(startAt),
      expiresAt: new Date(expiresAt),
      eventId: Number(eventId),
    },
  });
};
