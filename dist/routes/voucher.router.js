"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voucher_controller_1 = require("../controllers/voucher.controller");
const jwt_1 = require("../lib/jwt");
const router = express_1.default.Router();
router.post("/", jwt_1.verifyToken, voucher_controller_1.createVoucherController);
exports.default = router;
