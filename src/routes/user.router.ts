import { Router } from "express";
import {
  changePasswordController,
  getOrganizerController,
  getReferredByController,
  getReferredUsersController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { fileFilter } from "../lib/fileFilter";
import { uploader } from "../lib/multer";
import { verifyToken } from "../lib/jwt";
import { validateChangePassword } from "../validators/user.validator";

const router = Router();

router.get("/referrals", verifyToken, getReferredUsersController);
router.get("/referrals/by", verifyToken, getReferredByController);
router.get("/profile", verifyToken, getUserController);
router.get('/organizers/:id', getOrganizerController);

router.patch(
  "/",
  verifyToken,
  uploader(1).fields([{ name: "profilePicture", maxCount: 1 }]),
  fileFilter,
  updateUserController
);

router.patch(
  "/change-password",
  verifyToken,
  validateChangePassword,
  changePasswordController
);

export default router;
