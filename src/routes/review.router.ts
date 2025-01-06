import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { createReviewController } from "../controllers/review.controller";
import { validateReview } from "../validators/review.validator";

const router = Router();

router.post("/", verifyToken, validateReview, createReviewController);

export default router;
