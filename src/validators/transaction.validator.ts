import { body } from "express-validator";

const ticketPurchaseValidator = body("tickets")
  .isArray({ min: 1 })
  .withMessage("At least one ticket is required.")
  .custom((tickets) => {
    tickets.forEach((ticket: any) => {
      if (
        !ticket.ticketTypeId ||
        !Number.isInteger(ticket.ticketTypeId) ||
        ticket.ticketTypeId <= 0
      ) {
        throw new Error(`TicketTypeId should be a positive integer.`);
      }
      if (
        !ticket.quantity ||
        !Number.isInteger(ticket.quantity) ||
        ticket.quantity <= 0
      ) {
        throw new Error(`Quantity should be a positive integer.`);
      }
    });
    return true;
  });

const voucherValidator = body("voucherId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("VoucherId must be a positive integer.");

const couponValidator = body("couponId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("CouponId must be a positive integer.");

const pointsUsedValidator = body("pointsUsed")
  .optional()
  .isInt({ min: 0 })
  .withMessage("Points used must be a non-negative integer.");

export const validateTransactionBody = [
  ticketPurchaseValidator,
  voucherValidator,
  couponValidator,
  pointsUsedValidator,
];
