import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

interface UpdateProfileBody {
  fullName: string;
  email: string;
}

export const updateProfilePhotoService = async (
  body: UpdateProfileBody,
  //   profilePicture: Express.Multer.File,
  id: number
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    // const { secure_url } = await cloudinaryUpload(profilePicture);

    await prisma.user.update({
      where: { id },
      data: {
        ...body,
        // profilePicture: secure_url,
      },
    });

    return { message: "Update profile success" };
  } catch (error) {
    throw error;
  }
};
