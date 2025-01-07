"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.sendEmail = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = require("./nodemailer");
const config_1 = require("../config");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html }) {
    try {
        yield nodemailer_1.transporter.sendMail({
            from: "your-email@example.com", // Ganti dengan email pengirim
            to,
            subject,
            html,
        });
        console.log(`Email sent to: ${to}`);
    }
    catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
const generateToken = (payload, expiresIn = "15m") => {
    return (0, jsonwebtoken_1.sign)(payload, config_1.JWT_SECRET, { expiresIn: "20m" });
};
exports.generateToken = generateToken;
