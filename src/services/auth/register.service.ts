import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { prisma } from "../../lib/prisma";

export const registerService = async (body: User) => {
  try {
    const { fullName, email, password } = body;
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await hashPassword(password);
    const role = "CUSTOMER";
    const pointsBalance = 0;
    const phoneNumber = 0;
    const referralCode =
      "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const pointsExpiryDate = new Date();
    const address = "";

    return await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
        pointsBalance,
        phoneNumber,
        referralCode,
        pointsExpiryDate,
        address,
      },
    });
  } catch (error) {
    throw error;
  }
};
