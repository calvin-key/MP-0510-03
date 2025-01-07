import express from "express";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import {
  createTransactionController,
  getTransactionController,
  getUserTransactionsController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import { fileFilter } from "../lib/fileFilter";

const router = express.Router();

router.get("/user", verifyToken, getUserTransactionsController);
router.get("/:id", getTransactionController);
router.post("/", verifyToken, createTransactionController);
router.patch(
  "/:id",
  verifyToken,
  uploader(5).fields([{ name: "paymentProof", maxCount: 10 }]), // Allow multiple files for paymentProof
  fileFilter, // Ensure this is compatible with multiple files
  updateTransactionController
);

export default router;
