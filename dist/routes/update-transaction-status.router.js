"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const update_transaction_status_controller_1 = require("../controllers/update-transaction-status.controller");
const router = (0, express_1.Router)();
router.get("/", jwt_1.verifyToken, update_transaction_status_controller_1.getTransactionsByOrganizerIdController);
router.patch("/:transactionId/status", jwt_1.verifyToken, update_transaction_status_controller_1.updateTransactionStatusController);
exports.default = router;
