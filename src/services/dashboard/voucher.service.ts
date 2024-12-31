// src/services/voucher.service.ts
import { prisma } from "../../lib/prisma";
import {
  CreateVoucherInput,
  UseVoucherInput,
} from "../../types/dashboard/voucher";

export const createVoucherService = async (input: CreateVoucherInput) => {
  try {
    const {
      code,
      description,
      nominal,
      quantity,
      eventId,
      startAt,
      expiresAt,
    } = input;

    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if voucher code already exists for this event
    const existingVoucher = await prisma.voucher.findFirst({
      where: {
        code,
        eventId,
        isDeleted: false,
      },
    });

    if (existingVoucher) {
      throw new Error("Voucher code already exists for this event");
    }

    // Create new voucher
    const voucher = await prisma.voucher.create({
      data: {
        code,
        description,
        nominal,
        quantity,
        eventId,
        startAt: new Date(startAt),
        expiresAt: new Date(expiresAt),
      },
      include: {
        event: {
          select: {
            name: true,
            organizer: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return voucher;
  } catch (error) {
    throw error;
  }
};

export const getAllVouchersService = async () => {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            name: true,
            organizer: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return vouchers;
  } catch (error) {
    throw error;
  }
};

export const getEventVouchersService = async (eventId: number) => {
  try {
    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const vouchers = await prisma.voucher.findMany({
      where: {
        eventId,
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            name: true,
            organizer: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return vouchers;
  } catch (error) {
    throw error;
  }
};

export const useVoucherService = async (input: UseVoucherInput) => {
  try {
    const { code, eventId } = input;

    // Find voucher
    const voucher = await prisma.voucher.findFirst({
      where: {
        code,
        eventId,
        isDeleted: false,
      },
      include: {
        event: true,
      },
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    // Check if voucher period has started
    const now = new Date();
    if (now < voucher.startAt) {
      throw new Error("Voucher period has not started yet");
    }

    // Check if voucher has expired
    if (now > voucher.expiresAt) {
      throw new Error("Voucher has expired");
    }

    // Check if voucher quantity is available
    if (voucher.quantity <= 0) {
      throw new Error("Voucher quantity has been depleted");
    }

    // Update voucher quantity
    const updatedVoucher = await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        quantity: {
          decrement: 1,
        },
      },
      include: {
        event: {
          select: {
            name: true,
            organizer: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updatedVoucher;
  } catch (error) {
    throw error;
  }
};

export const deleteVoucherService = async (id: number) => {
  try {
    // Check if voucher exists
    const voucher = await prisma.voucher.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    // Soft delete the voucher
    const deletedVoucher = await prisma.voucher.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return deletedVoucher;
  } catch (error) {
    throw error;
  }
};
