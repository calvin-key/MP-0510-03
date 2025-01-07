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
import { validateTransactionBody } from "../validators/transaction.validator";

const router = express.Router();

router.get("/user", verifyToken, getUserTransactionsController);
router.get("/:id", getTransactionController);
router.post("/", verifyToken, createTransactionController);
router.patch(
  "/:id",
  verifyToken,
  uploader(5).fields([{ name: "paymentProof", maxCount: 10 }]),
  fileFilter,
  validateTransactionBody,
  updateTransactionController
);

export default router;
