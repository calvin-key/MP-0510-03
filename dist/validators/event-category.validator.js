"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateEventCategories = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateEventCategories = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
