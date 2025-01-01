import { cloudinaryUpload, cloudinaryRemove } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { Role } from "@prisma/client";

interface UpdateUserBody {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: Express.Multer.File;
  role?: Role;
}

export const updateUserService = async (id: number, body: UpdateUserBody) => {
  try {
    const { fullName, email, phoneNumber, address, profilePicture, role } =
      body;

    if (role && !Object.values(Role).includes(role)) {
      throw new Error("Invalid role");
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: id } },
      });

      if (existingUser) {
        throw new Error("Email already in use!");
      }
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    let profilePictureUrl = currentUser.profilePicture;
    if (profilePicture) {
      if (currentUser.profilePicture) {
        await cloudinaryRemove(currentUser.profilePicture);
      }
      const { secure_url } = await cloudinaryUpload(profilePicture);
      profilePictureUrl = secure_url;
    }

    return await prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        phoneNumber,
        address,
        profilePicture: profilePictureUrl,
        role,
      },
    });
  } catch (error) {
    throw error;
  }
};
