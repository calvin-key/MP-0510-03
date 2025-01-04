import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetCouponsQuery {
  id?: number;
  search?: string;
  isUsed?: Boolean;
}

export const getCouponsService = async (query: GetCouponsQuery) => {
  try {
    const { id, search, isUsed } = query;
    const whereClause: Prisma.CouponWhereInput = {};

    if (id) {
      whereClause.id = id;
    }

    if (isUsed) {
      whereClause.isUsed = Boolean(isUsed);
    }

    if (search) {
      whereClause.OR = [{ code: { equals: search } }];
    }

    const coupons = await prisma.coupon.findMany({
      where: whereClause,
    });

    return { data: coupons };
  } catch (error) {
    throw error;
  }
};
