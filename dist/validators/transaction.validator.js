"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionBody = void 0;
const express_validator_1 = require("express-validator");
const ticketPurchaseValidator = (0, express_validator_1.body)("tickets")
    .isArray({ min: 1 })
    .withMessage("At least one ticket is required.")
    .custom((tickets) => {
    tickets.forEach((ticket) => {
        if (!ticket.ticketTypeId ||
            !Number.isInteger(ticket.ticketTypeId) ||
            ticket.ticketTypeId <= 0) {
            throw new Error(`TicketTypeId should be a positive integer.`);
        }
        if (!ticket.quantity ||
            !Number.isInteger(ticket.quantity) ||
            ticket.quantity <= 0) {
            throw new Error(`Quantity should be a positive integer.`);
        }
    });
    return true;
});
const voucherValidator = (0, express_validator_1.body)("voucherId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("VoucherId must be a positive integer.");
const couponValidator = (0, express_validator_1.body)("couponId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("CouponId must be a positive integer.");
const pointsUsedValidator = (0, express_validator_1.body)("pointsUsed")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points used must be a non-negative integer.");
exports.validateTransactionBody = [
    ticketPurchaseValidator,
    voucherValidator,
    couponValidator,
    pointsUsedValidator,
];
