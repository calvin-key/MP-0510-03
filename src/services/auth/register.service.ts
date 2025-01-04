import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { generateReferralCode } from "../../lib/referral";
import { generateUniqueCouponCode } from "../../lib/coupon";
import { prisma } from "../../lib/prisma";

interface RegisterInput
  extends Omit<
    User,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "phoneNumber"
    | "role"
    | "profilePicture"
    | "referralCode"
    | "pointsBalance"
    | "pointsExpiryDate"
    | "address"
    | "isDeleted"
  > {
  referralCode?: string;
}

export const registerService = async (body: RegisterInput) => {
  try {
    const { fullName, email, password, referralCode } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const normalizedReferralCode = referralCode?.toLowerCase();

    let referrer = null;
    if (normalizedReferralCode) {
      referrer = await prisma.user.findUnique({
        where: {
          referralCode: normalizedReferralCode,
        },
      });

      if (!referrer) {
        throw new Error("Invalid referral code!");
      }
    }

    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    const pointsExpiryDate = new Date();
    pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        referralCode: userReferralCode,
        role: "CUSTOMER",
        phoneNumber: "",
        pointsBalance: 0,
        pointsExpiryDate,
      },
    });

    if (referrer) {
      await prisma.referralHistory.create({
        data: {
          referrerId: referrer.id,
          referredId: newUser.id,
          pointsAwarded: 10000,
        },
      });

      await prisma.point.create({
        data: {
          userId: referrer.id,
          points: 10000,
          expiredAt: pointsExpiryDate,
        },
      });

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          pointsBalance: {
            increment: 10000,
          },
        },
      });

      const couponCode = await generateUniqueCouponCode();
      const coupon = await prisma.coupon.create({
        data: {
          code: couponCode,
          nominal: 50000,
        },
      });

      await prisma.userCoupon.create({
        data: {
          userId: newUser.id,
          couponId: coupon.id,
        },
      });
    }

    return newUser;
  } catch (error) {
    throw error;
  }
};
