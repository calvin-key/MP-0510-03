import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateCreateEvent = [
  body("name").notEmpty().withMessage("Event name is required"),
  body("description").notEmpty().withMessage("Event description is required"),
  body("address").notEmpty().withMessage("Event address is required"),
  body("specificLocation")
    .notEmpty()
    .withMessage("Specific location is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be in valid format"),
  body("endDate").isISO8601().withMessage("End date must be in valid format"),
  body("city").notEmpty().withMessage("City is required"),

  body("categories")
    .custom((value) => {
      if (typeof value === "string") {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error("Categories must be an array");
        }
      } else if (!Array.isArray(value)) {
        throw new Error("Categories must be an array");
      }
      return true;
    })
    .withMessage("Invalid categories format"),

    body("ticketTypes")
    .custom((value) => {
      if (typeof value === "string") {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error("Ticket types must be an array");
        }
        parsed.forEach((ticket: any) => {
          if (
            ticket.ticketType === undefined ||
            ticket.price === undefined ||
            ticket.availableSeats === undefined
          ) {
            throw new Error(
              "Each ticket type must include ticketType, price, and availableSeats"
            );
          }
  
          if (typeof ticket.price !== "number" || ticket.price < 0) {
            throw new Error("Ticket price must be a non-negative number");
          }
        });
      } else if (!Array.isArray(value)) {
        throw new Error("Ticket types must be an array");
      }
      return true;
    })
    .withMessage("Invalid ticket types format"),
  

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    if (typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }

    if (typeof req.body.ticketTypes === "string") {
      req.body.ticketTypes = JSON.parse(req.body.ticketTypes);
    }
    
    next();
  },
];
