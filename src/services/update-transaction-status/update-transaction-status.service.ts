import { TransactionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { transporter } from "../../lib/nodemailer";
import { sendNotificationEmail } from "../../lib/handlebars";

export const updateTransactionStatusService = async (
  transactionId: number,
  status: TransactionStatus,
  notes?: string
) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        confirmedAt: status === "done" ? new Date() : null,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        TicketType: {
          select: {
            event: {
              select: {
                name: true,
              },
            },
            ticketType: true,
            price: true,
          },
        },
        voucher: {
          select: {
            nominal: true,
          },
        },
        coupon: {
          select: {
            nominal: true,
          },
        },
        items: {
          select: {
            quantity: true,
            pricePerUnit: true,
            subtotal: true,
          },
        },
      },
    });

    const email = transaction.user.email;

    await sendNotificationEmail({ email, status });

    // transporter.sendMail({
    //   to: transaction.user.email,
    //   subject: "Your Ticket",
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //       <style>
    //         body {
    //           font-family: Arial, sans-serif;
    //           line-height: 1.6;
    //           max-width: 600px;
    //           margin: 0 auto;
    //           padding: 20px;
    //           background-color: #f4f4f4;
    //         }
    //         .email-container {
    //           background-color: white;
    //           padding: 30px;
    //           border-radius: 8px;
    //           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    //         }
    //         h1 {
    //           color: #2c3e50;
    //           font-size: 24px;
    //           margin-bottom: 20px;
    //           text-align: center;
    //           border-bottom: 2px solid #3498db;
    //           padding-bottom: 10px;
    //         }
    //         p {
    //           color: #34495e;
    //           font-size: 16px;
    //           margin: 15px 0;
    //         }
    //         .status {
    //           background-color: #e8f5e9;
    //           padding: 10px 15px;
    //           border-radius: 4px;
    //           border-left: 4px solid #4caf50;
    //           margin-top: 20px;
    //         }
    //         .footer {
    //           margin-top: 30px;
    //           text-align: center;
    //           font-size: 14px;
    //           color: #7f8c8d;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="email-container">
    //         <h1>Thank you for your purchase! 🎉</h1>
    //         <div class="status">
    //           <p>Transaction Status: <strong>${transaction.status}</strong></p>
    //         </div>
    //         <div class="footer">
    //           <p>If you have any questions, please don't hesitate to contact us.</p>
    //         </div>
    //       </div>
    //     </body>
    //     </html>
    //   `,
    // });

    return transaction;
  } catch (error) {
    throw error;
  }
};
