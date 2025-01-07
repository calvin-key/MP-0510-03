import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { generateReferralCode } from "../../lib/referral";
import { generateUniqueCouponCode } from "../../lib/coupon";
import { prisma } from "../../lib/prisma";

export const registerService = async (body: User) => {
export const registerService = async (body: User) => {
  try {
    const { fullName, email, password, referralCode, role } = body;
    const { fullName, email, password, referralCode, role } = body;

    // Check if email exists
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
        throw new Error("Invalid referral code!");
        throw new Error("Invalid referral code!");
      }
    }

    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    // Set points expiry date to 3 months from now
    const pointsExpiryDate = new Date();
    pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        referralCode: userReferralCode,
        role,
        role,
        phoneNumber: "",
        pointsBalance: 0,
        pointsExpiryDate,
      },
    });

    // If user registered with referral code
    if (referrer) {
      // Create referral history
      await prisma.referralHistory.create({
        data: {
          referrerId: referrer.id,
          referredId: newUser.id,
          pointsAwarded: 10000,
        },
      });

      // Add points to referrer
      await prisma.point.create({
        data: {
          userId: referrer.id,
          points: 10000,
          expiredAt: pointsExpiryDate,
        },
      });

      // Update referrer's points balance
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          pointsBalance: {
            increment: 10000,
          },
        },
      });

      const couponExpiryDate = new Date();
      couponExpiryDate.setMonth(couponExpiryDate.getMonth() + 3);

      const couponCode = await generateUniqueCouponCode();


      const coupon = await prisma.coupon.create({
        data: {
          code: couponCode,
          nominal: 50000,
          expiredAt: couponExpiryDate,
          isUsed: false,
        },
      });

      // Create user-coupon relationship
      await prisma.userCoupon.create({
        data: {
          userId: newUser.id,
          couponId: coupon.id,
          isUsed: false,
        },
      });
    }

    const userWithRelations = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        userCoupons: {
          include: {
            coupon: true,
          },
        },
      },
    });

    return userWithRelations;
  } catch (error) {
    throw error;
  }
};
