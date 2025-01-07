"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateEvent = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateEvent = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Event name is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Event description is required"),
    (0, express_validator_1.body)("address").notEmpty().withMessage("Event address is required"),
    (0, express_validator_1.body)("specificLocation")
        .notEmpty()
        .withMessage("Specific location is required"),
    (0, express_validator_1.body)("startDate")
        .isISO8601()
        .withMessage("Start date must be in valid format"),
    (0, express_validator_1.body)("endDate").isISO8601().withMessage("End date must be in valid format"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("categories")
        .custom((value) => {
        if (typeof value === "string") {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
                throw new Error("Categories must be an array");
            }
        }
        else if (!Array.isArray(value)) {
            throw new Error("Categories must be an array");
        }
        return true;
    })
        .withMessage("Invalid categories format"),
    (0, express_validator_1.body)("ticketTypes")
        .custom((value) => {
        if (typeof value === "string") {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
                throw new Error("Ticket types must be an array");
            }
            parsed.forEach((ticket) => {
                if (!ticket.ticketType || !ticket.price || !ticket.availableSeats) {
                    throw new Error("Each ticket type must include ticketType, price, and availableSeats");
                }
            });
        }
        else if (!Array.isArray(value)) {
            throw new Error("Ticket types must be an array");
        }
        return true;
    })
        .withMessage("Invalid ticket types format"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
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
