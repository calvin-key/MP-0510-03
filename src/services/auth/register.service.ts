import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { generateReferralCode } from "../../lib/referral";
import { generateUniqueCouponCode } from "../../lib/coupon";
import { prisma } from "../../lib/prisma";

// Definisikan interface untuk input registrasi
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

    // Validasi email yang sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email sudah terdaftar!");
    }

    // Normalize referral code jika ada
    const normalizedReferralCode = referralCode?.toLowerCase();

    // Cek referrer jika ada referral code
    let referrer = null;
    if (normalizedReferralCode) {
      referrer = await prisma.user.findUnique({
        where: {
          referralCode: normalizedReferralCode,
        },
      });

      if (!referrer) {
        throw new Error("Kode referral tidak valid!");
      }
    }

    // Hash password dan generate referral code baru
    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    // Set tanggal expired point dan coupon (3 bulan)
    const pointsExpiryDate = new Date();
    pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        referralCode: userReferralCode,
        role: "CUSTOMER",
        phoneNumber: 0, // Default sesuai schema
        pointsBalance: 0,
        pointsExpiryDate,
      },
    });

    // Proses referral jika ada
    if (referrer) {
      // Buat history referral
      await prisma.refferalHistory.create({
        data: {
          referrerId: referrer.id,
          referredId: newUser.id,
          pointsAwarded: 10000,
        },
      });

      // Tambah point untuk referrer
      await prisma.point.create({
        data: {
          userId: referrer.id,
          points: 10000,
          expiredAt: pointsExpiryDate,
        },
      });

      // Update total point referrer
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          pointsBalance: {
            increment: 10000,
          },
        },
      });

      // Generate dan buat coupon untuk user baru
      const couponCode = await generateUniqueCouponCode();
      const coupon = await prisma.coupon.create({
        data: {
          code: couponCode,
          nominal: 50000, // Nilai diskon
        },
      });

      // Assign coupon ke user baru
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
