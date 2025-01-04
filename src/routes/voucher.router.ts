import express from "express";
import { createVoucherController } from "../controllers/voucher.controller";
import { verifyToken } from "../lib/jwt";

const router = express.Router();

// router.post("/", verifyToken, createVoucherController);
router.post("/", createVoucherController);

export default router;
