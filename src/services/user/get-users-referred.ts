import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface getReferredUsersQuery extends PaginationQueryParams {}

export const getReferredUsersService = async (
  id: number,
  query: getReferredUsersQuery
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }

    const { page, sortBy, sortOrder, take } = query;

    const referredUsers = await prisma.referralHistory.findMany({
      where: { referredId: id },
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      include: { referred: { select: { fullName: true } } },
    });

    if (!referredUsers) {
      throw new Error("No users referred");
    }

    const count = await prisma.referralHistory.count({
      where: { referrerId: id },
    });

    return {
      data: referredUsers,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
