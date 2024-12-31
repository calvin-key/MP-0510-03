import { Router } from "express";
import {
  changePasswordController,
  getProfileController,
} from "../controllers/dashboard.controller";
import { verifyToken } from "../lib/jwt";
import { validateChangePassword } from "../validators/dashboard.validator";

const router = Router();

router.get("/profile", verifyToken, getProfileController);

router.patch(
  "/change-password",
  verifyToken,
  validateChangePassword,
  changePasswordController
);

export default router;
