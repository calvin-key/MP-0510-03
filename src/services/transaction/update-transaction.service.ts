import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../lib/cloudinary";

export const updateTransactionService = async (
    transactionId: number,
    paymentProofFile: Express.Multer.File,
    userId: number
  ) => {
    try {
      // First find the transaction
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });
  
      if (!transaction) {
        throw new Error("Transaction not found");
      }
  
      if (transaction.userId !== userId) {
        throw new Error("Unauthorized");
      }
  
      if (transaction.status !== "waiting_for_payment") {
        throw new Error("Transaction cannot be updated");
      }
  
      // Upload to cloudinary and destructure secure_url directly
      const { secure_url } = await cloudinaryUpload(paymentProofFile);
  
      // Update the transaction
      return await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          paymentProof: secure_url,
          status: "waiting_for_admin_confirmation",
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      throw error;
    }
  };