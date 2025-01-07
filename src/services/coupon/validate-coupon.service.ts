import { prisma } from "../../lib/prisma";

export const validateCouponService = async (code: string, userId: number) => {
  try {
    // First check if coupon exists
    const coupon = await prisma.coupon.findFirst({
      where: { code },
    });

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    // Check if coupon is expired
    if (coupon.expiredAt < new Date()) {
      throw new Error("Coupon has expired");
    }

    // Check if user owns this coupon
    const userCoupon = await prisma.userCoupon.findFirst({
      where: {
        userId,
        couponId: coupon.id,
      },
      include: {
        coupon: true,
      },
    });

    if (!userCoupon) {
      throw new Error("This coupon doesn't belong to you");
    }

    // Check if coupon is already used
    if (userCoupon.isUsed) {
      throw new Error("This coupon has already been used");
    }

    return {
      id: userCoupon.couponId,
      code: userCoupon.coupon.code,
      nominal: userCoupon.coupon.nominal,
    };
  } catch (error) {
    throw error;
  }
};
