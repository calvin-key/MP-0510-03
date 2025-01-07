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
exports.updateTransactionController = exports.createTransactionController = exports.getUserTransactionsController = exports.getTransactionController = void 0;
const update_transaction_service_1 = require("../services/transaction/update-transaction.service");
const create_transaction_service_1 = require("../services/transaction/create-transaction.service");
const get_transaction_service_1 = require("../services/transaction/get-transaction.service");
const get_user_transactions_service_1 = require("../services/transaction/get-user-transactions.service");
const getTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, get_transaction_service_1.getTransactionService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionController = getTransactionController;
const getUserTransactionsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        const transactions = yield (0, get_user_transactions_service_1.getUserTransactionsService)(userId);
        res.status(200).send(transactions);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserTransactionsController = getUserTransactionsController;
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        const transaction = yield (0, create_transaction_service_1.createTransactionService)(req.body, userId);
        res.status(201).send(transaction);
    }
    catch (error) {
        next(error);
    }
});
exports.createTransactionController = createTransactionController;
const updateTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = res.locals.user.id;
        const transactionId = parseInt(req.params.id);
        const files = req.files;
<<<<<<< HEAD
        // Check if paymentProof file exists
=======
>>>>>>> main
        if (!((_a = files === null || files === void 0 ? void 0 : files.paymentProof) === null || _a === void 0 ? void 0 : _a[0])) {
            res.status(400).json({
                status: "error",
                message: "Payment proof is required",
            });
            return;
        }
        const updatedTransaction = yield (0, update_transaction_service_1.updateTransactionService)(transactionId, (_b = files.paymentProof) === null || _b === void 0 ? void 0 : _b[0], userId);
        res.status(201).json(updatedTransaction);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTransactionController = updateTransactionController;
