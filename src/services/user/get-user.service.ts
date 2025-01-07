import { prisma } from "../../lib/prisma";

export const getUserService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        userCoupons: {
          include: {
            coupon: true,
          },
        },
        points: {
          orderBy: {
            expiredAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { password: pass, ...userWithoutPassword } = user;

    // Calculate total points balance
    const pointsBalance = await prisma.point.aggregate({
      where: {
        userId: id,
        expiredAt: {
          gt: new Date(),
        },
      },
      _sum: {
        points: true,
      },
    });

    // Get latest points expiry date
    const latestPoint = user.points[0];

    return {
      ...userWithoutPassword,
      pointsBalance: pointsBalance._sum.points || 0,
      pointsExpiryDate: latestPoint?.expiredAt || new Date(),
      userCoupons: user.userCoupons.map((uc) => ({
        ...uc,
        coupon: {
          ...uc.coupon,
          nominal: Number(uc.coupon.nominal), // Ensure nominal is a number
        },
      })),
    };
  } catch (error) {
    throw error;
  }
};
