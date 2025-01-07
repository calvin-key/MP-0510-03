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
exports.updateTransactionService = void 0;
const prisma_1 = require("../../lib/prisma");
const cloudinary_1 = require("../../lib/cloudinary");
const updateTransactionService = (transactionId, paymentProofFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First find the transaction
        const transaction = yield prisma_1.prisma.transaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.userId !== userId) {
            throw new Error("Unauthorized");
        }
        if (transaction.status !== "waiting_for_payment") {
            throw new Error("Transaction cannot be updated");
        }
        // Upload to cloudinary and destructure secure_url directly
        const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(paymentProofFile);
        // Update the transaction
        return yield prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                paymentProof: secure_url,
                status: "waiting_for_admin_confirmation",
            },
            include: {
                items: true,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateTransactionService = updateTransactionService;
