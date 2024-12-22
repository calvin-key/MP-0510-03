"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMAIL_APP_PASSWORD = exports.GMAIL_EMAIL = exports.JWT_SECRET_FORGOT_PASSWORD = exports.JWT_SECRET = exports.BASE_URL_FE = exports.SUPABASE_PORT = exports.SUPABASE_DATABASE = exports.SUPABASE_PASSWORD = exports.SUPABASE_USER = exports.SUPABASE_HOST = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.SUPABASE_HOST = process.env.SUPABASE_HOST;
exports.SUPABASE_USER = process.env.SUPABASE_USER;
exports.SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;
exports.SUPABASE_DATABASE = process.env.SUPABASE_DATABASE;
exports.SUPABASE_PORT = Number(process.env.SUPABASE_PORT);
exports.BASE_URL_FE = process.env.BASE_URL_FE;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET_FORGOT_PASSWORD = process.env.JWT_SECRET_FORGOT_PASSWORD;
exports.GMAIL_EMAIL = process.env.GMAIL_EMAIL;
exports.GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
