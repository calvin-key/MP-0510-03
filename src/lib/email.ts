// utils/email.ts
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface EmailParams {
  to: string;
  type: "TRANSACTION_ACCEPTED" | "TRANSACTION_REJECTED";
  transactionId: number;
}

export const sendTransactionEmail = async ({
  to,
  type,
  transactionId,
}: EmailParams) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: {
          include: {
            ticketType: true,
          },
        },
        user: true,
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject = "";
    let html = "";

    if (type === "TRANSACTION_ACCEPTED") {
      subject = "Your Transaction Has Been Accepted";
      html = `
        <h1>Transaction Accepted</h1>
        <p>Dear ${transaction.user.fullName},</p>
        <p>Your transaction (ID: ${transaction.id}) has been accepted.</p>
        <p>Transaction Details:</p>
        <ul>
          ${transaction.items
            .map(
              (item) => `
            <li>${item.ticketType.ticketType}: ${item.quantity} tickets</li>
          `
            )
            .join("")}
        </ul>
        <p>Total Amount: ${transaction.totalPrice}</p>
      `;
    } else {
      subject = "Your Transaction Has Been Rejected";
      html = `
        <h1>Transaction Rejected</h1>
        <p>Dear ${transaction.user.fullName},</p>
        <p>Your transaction (ID: ${transaction.id}) has been rejected.</p>
        <p>If you used any points or vouchers, they have been returned to your account.</p>
        <p>You can try submitting a new transaction or contact our support team for assistance.</p>
      `;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
