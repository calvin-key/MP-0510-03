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
exports.createVoucherController = void 0;
const create_voucher_service_1 = require("../services/voucher/create-voucher.service");
const createVoucherController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizerId = Number(res.locals.user.id);
        const voucher = yield (0, create_voucher_service_1.createVoucherService)(organizerId, req.body);
        res.status(201).json({ message: "Voucher created successfully.", voucher });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createVoucherController = createVoucherController;
