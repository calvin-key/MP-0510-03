// src/types/voucher.ts
import { Voucher } from "@prisma/client";

export interface CreateVoucherInput
  extends Omit<Voucher, "id" | "createdAt" | "updatedAt" | "isDeleted"> {}

export interface UseVoucherInput {
  code: string;
  eventId: number;
}
