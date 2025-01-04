import { Router } from "express";
import {
  checkReferralController,
  createReferralController,
  getReferralsController,
} from "../controllers/referral.controller";
import { validateCreateReferral } from "../validators/referral.validator";

const router = Router();

router.get("/", checkReferralController);
router.get("/", getReferralsController);
router.post("/", validateCreateReferral, createReferralController);

export default router;
