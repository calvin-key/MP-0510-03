import { sign } from "jsonwebtoken";
import { transporter } from "./nodemailer";
import { JWT_SECRET } from "../config";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
  try {
    await transporter.sendMail({
      from: "your-email@example.com", // Ganti dengan email pengirim
      to,
      subject,
      html,
    });
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export const generateToken = (
  payload: object,
  expiresIn: string = "15m"
): string => {
  return sign(payload, JWT_SECRET!, { expiresIn: "20m" });
};
