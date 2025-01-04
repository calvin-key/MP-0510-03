import { prisma } from "../../lib/prisma";

interface CreateReferralInput {
  referrerId: number;
  referredId: number;
  pointsAwarded: number;
}

export const createReferralService = async (input: CreateReferralInput) => {
  try {
    const { referrerId, referredId, pointsAwarded } = input;

    // Validasi referrer dan referred user
    const referrer = await prisma.user.findUnique({
      where: { id: referrerId },
    });
    const referred = await prisma.user.findUnique({
      where: { id: referredId },
    });

    if (!referrer || referrer.isDeleted) {
      throw new Error(`Referrer dengan ID ${referrerId} tidak ditemukan`);
    }

    if (!referred || referred.isDeleted) {
      throw new Error(
        `Pengguna yang dirujuk dengan ID ${referredId} tidak ditemukan`
      );
    }

    // Buat referral baru
    const referral = await prisma.referralHistory.create({
      data: {
        referrerId,
        referredId,
        pointsAwarded,
      },
    });

    // Perbarui saldo poin pengguna yang merujuk
    await prisma.user.update({
      where: { id: referrerId },
      data: { pointsBalance: { increment: pointsAwarded } },
    });

    return referral;
  } catch (error) {
    throw error;
  }
};
