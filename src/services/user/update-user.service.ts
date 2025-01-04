import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { cloudinaryUpload, cloudinaryRemove } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface UpdateUserBody {
  fullName: string;
}

export const updateUserService = async (
  body: UpdateUserBody,
  profilePicture: Express.Multer.File | undefined,
  id: number
) => {
  try {
    console.log(body, profilePicture, id);

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    let secure_url: string | undefined;
    if (profilePicture) {
      if (user.profilePicture !== null) {
        await cloudinaryRemove(user.profilePicture);
      }

      const uploadResult = await cloudinaryUpload(profilePicture);
      secure_url = uploadResult.secure_url;
    }

    await prisma.user.update({
      where: { id },
      data: secure_url ? { ...body, profilePicture: secure_url } : body,
    });

    return { message: "Update profile success" };
  } catch (error) {
    throw error;
  }
};
