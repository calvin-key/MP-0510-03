import handlebars from "handlebars";
import { transporter } from "./nodemailer";
import { forgotPasswordTemplate } from "../templates/ForgotPassword";
import { notificationTransactionTemplate } from "../templates/NotificationTransaction";

export const sendForgotPasswordEmail = async (data: {
  email: string;
  link: string;
}) => {
  const { email, link } = data;

  const template = handlebars.compile(forgotPasswordTemplate);

  const html = template({
    email,
    link,
  });

  const mailOptions = {
    from: `"Star Ticket" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Forgot password email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};

export const sendNotificationEmail = async (data: {
  email: string;
  status: string;
}) => {
  const { email, status } = data;

  const template = handlebars.compile(notificationTransactionTemplate);

  const html = template({
    status,
  });

  const mailOptions = {
    from: `"Scaena" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Transaction Status: ${status}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Forgot password email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending notification email:", error);
  }
};
