import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  getTransactionsByOrganizerIdController,
  rejectTransactionController,
} from "../controllers/confirm-transaction.controller";

const router = Router();

router.get("/organizer", verifyToken, getTransactionsByOrganizerIdController);
router.post("/reject/:id", verifyToken, rejectTransactionController);

export default router;
