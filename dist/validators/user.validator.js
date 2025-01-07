"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangePassword = void 0;
const express_validator_1 = require("express-validator");
exports.validateChangePassword = [
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (0, express_validator_1.body)("newPassword").notEmpty().withMessage("New Password is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0].msg });
            return;
        }
        next();
    },
];
