import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import { prisma } from "../../lib/prisma";

interface GetReferralsQuery extends PaginationQueryParams {
  userId?: number;
  eventId?: number;
}

export const getReferralsService = async (query: GetReferralsQuery) => {
  try {
    const { page, sortBy, sortOrder, take, userId, eventId } = query;

    const whereClause: Prisma.ReferralHistoryWhereInput = {};

    if (userId) {
      whereClause.OR = [{ referrerId: userId }, { referredId: userId }];
    }

    const referrals = await prisma.referralHistory.findMany({
      where: whereClause,
      include: {
        referrer: {
          select: {
            fullName: true,
          },
        },
        referred: {
          select: {
            fullName: true,
          },
        },
      },
      skip: (page - 1) * take,
      take,
      orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
    });

    const count = await prisma.referralHistory.count({
      where: whereClause,
    });

    return {
      data: referrals,
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
