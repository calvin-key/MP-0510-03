import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  getTransactionsByOrganizerIdController,
  updateTransactionStatusController,
} from "../controllers/update-transaction-status.controller";

const router = Router();

router.get("/", verifyToken, getTransactionsByOrganizerIdController);
router.patch(
  "/:transactionId/status",
  verifyToken,
  updateTransactionStatusController
);

export default router;
