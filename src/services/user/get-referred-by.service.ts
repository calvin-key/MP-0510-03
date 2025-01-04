import { prisma } from "../../lib/prisma";

export const getReferredByService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }

    const userReferrer = await prisma.referralHistory.findFirst({
      where: { referredId: userId },
      include: { referrer: { select: { fullName: true } } },
    });

    if (!userReferrer) {
      throw new Error("Not referred by anyone");
    }

    return {
      referredBy: userReferrer.referrer,
    };
  } catch (error) {
    throw error;
  }
};
