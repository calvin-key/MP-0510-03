import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateChangePassword = [
  body("password").notEmpty().withMessage("Password is required"),
  body("newPassword").notEmpty().withMessage("New Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
