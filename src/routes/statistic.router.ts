// routes/statistics.routes.ts
import { Router } from "express";
import { getTransactionStatisticsController } from "../controllers/statistic.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/transactions", verifyToken, getTransactionStatisticsController);

export default router;
