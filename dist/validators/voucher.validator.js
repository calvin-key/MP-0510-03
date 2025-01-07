"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateVoucher = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};
exports.validateCreateVoucher = [
    (0, express_validator_1.body)('eventId')
        .notEmpty()
        .withMessage('Event ID is required')
        .isInt()
        .withMessage('Event ID must be a number')
        .toInt(),
    (0, express_validator_1.body)('code')
        .notEmpty()
        .withMessage('Code is required')
        .isString()
        .withMessage('Code must be a string')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Code must be between 3 and 50 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ min: 3, max: 500 })
        .withMessage('Description must be between 3 and 500 characters'),
    (0, express_validator_1.body)('nominal')
        .notEmpty()
        .withMessage('Nominal is required')
        .isInt({ min: 1 })
        .withMessage('Nominal must be a positive number')
        .toInt(),
    (0, express_validator_1.body)('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive number')
        .toInt(),
    (0, express_validator_1.body)('startAt')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid date format')
        .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        if (date <= new Date()) {
            throw new Error('Start date must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('expiresAt')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Expiry date must be a valid date format')
        .custom((value, { req }) => {
        const expiryDate = new Date(value);
        const startDate = new Date(req.body.startAt);
        if (isNaN(expiryDate.getTime())) {
            throw new Error('Invalid date format');
        }
        if (expiryDate <= new Date()) {
            throw new Error('Expiry date must be in the future');
        }
        if (expiryDate <= startDate) {
            throw new Error('Expiry date must be after start date');
        }
        return true;
    }),
    validate
];
