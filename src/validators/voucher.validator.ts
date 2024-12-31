// src/validators/voucher.validator.ts
import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const validateCreateVoucher = [
  body("code").notEmpty().withMessage("Voucher code is required").isString(),
  body("description").optional().isString(),
  body("nominal").notEmpty().withMessage("Nominal is required").isNumeric(),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isInt()
    .withMessage("Event ID must be a number"),
  body("startAt")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("expiresAt")
    .notEmpty()
    .withMessage("Expiry date is required")
    .isISO8601()
    .withMessage("Expiry date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startAt)) {
        throw new Error("Expiry date must be after start date");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];

export const validateUseVoucher = [
  body("code").notEmpty().withMessage("Voucher code is required").isString(),
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isInt()
    .withMessage("Event ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];

export const validateEventIdParam = [
  param("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isInt()
    .withMessage("Event ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];

export const validateVoucherId = [
  param("id")
    .notEmpty()
    .withMessage("Voucher ID is required")
    .isInt()
    .withMessage("Voucher ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }
    next();
  },
];
