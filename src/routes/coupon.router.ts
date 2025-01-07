import { Router } from "express";
import { validateCouponController } from "../controllers/coupon.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.post("/validate", verifyToken, validateCouponController);

export default router;
