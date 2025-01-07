"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../lib/jwt");
const multer_1 = require("../lib/multer");
const transaction_controller_1 = require("../controllers/transaction.controller");
const fileFilter_1 = require("../lib/fileFilter");
<<<<<<< HEAD
=======
const transaction_validator_1 = require("../validators/transaction.validator");
>>>>>>> main
const router = express_1.default.Router();
router.get("/user", jwt_1.verifyToken, transaction_controller_1.getUserTransactionsController);
router.get("/:id", transaction_controller_1.getTransactionController);
router.post("/", jwt_1.verifyToken, transaction_controller_1.createTransactionController);
<<<<<<< HEAD
router.patch("/:id", jwt_1.verifyToken, (0, multer_1.uploader)(5).fields([{ name: "paymentProof", maxCount: 10 }]), // Allow multiple files for paymentProof
fileFilter_1.fileFilter, // Ensure this is compatible with multiple files
transaction_controller_1.updateTransactionController);
=======
router.patch("/:id", jwt_1.verifyToken, (0, multer_1.uploader)(5).fields([{ name: "paymentProof", maxCount: 10 }]), fileFilter_1.fileFilter, transaction_validator_1.validateTransactionBody, transaction_controller_1.updateTransactionController);
>>>>>>> main
exports.default = router;
