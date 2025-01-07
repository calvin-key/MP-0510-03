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
exports.updateTransactionStatusController = exports.getTransactionsByOrganizerIdController = void 0;
const update_transaction_status_service_1 = require("../services/update-transaction-status/update-transaction-status.service");
const get_transaction_by_organizer_id_service_1 = require("../services/update-transaction-status/get-transaction-by-organizer-id.service");
const getTransactionsByOrganizerIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search || "",
        };
        const results = yield (0, get_transaction_by_organizer_id_service_1.getTransactionsByOrganizerIdService)(Number(res.locals.user.id), query);
        res.status(200).send(results);
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionsByOrganizerIdController = getTransactionsByOrganizerIdController;
const updateTransactionStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        const { status, notes } = req.body;
        const result = yield (0, update_transaction_status_service_1.updateTransactionStatusService)(parseInt(transactionId), status);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTransactionStatusController = updateTransactionStatusController;
