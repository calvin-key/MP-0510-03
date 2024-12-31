// src/routes/voucher.routes.ts
import express from "express";
import {
  createVoucherController,
  deleteVoucherController,
  getAllVouchersController,
  getEventVouchersController,
  useVoucherController,
} from "../controllers/voucher.controller";
import {
  validateCreateVoucher,
  validateUseVoucher,
  validateEventIdParam,
  validateVoucherId,
} from "../validators/voucher.validator";

const router = express.Router();

// Routes dengan validator yang sudah include validation function
router.post("/vouchers", validateCreateVoucher, createVoucherController);
router.get("/vouchers", getAllVouchersController);
router.get(
  "/vouchers/event/:eventId",
  validateEventIdParam,
  getEventVouchersController
);
router.post("/vouchers/use", validateUseVoucher, useVoucherController);
router.delete("/vouchers/:id", validateVoucherId, deleteVoucherController);

export default router;
