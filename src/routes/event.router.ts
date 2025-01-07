import { Router } from "express";
import {
  createEventController,
  editEventController,
  getEventController,
  getEventsController,
  getOrganizerEventsController,
  getReviewableEventsController,
} from "../controllers/event.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateCreateEvent } from "../validators/event.validator";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/reviewable", verifyToken, getReviewableEventsController);
router.get("/organizer", verifyToken, getOrganizerEventsController);
router.get("/", getEventsController);
router.get("/:id", getEventController);
router.post(
  "/",
  verifyToken,
  uploader(5).fields([{ name: "image", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);

router.patch(
  "/:id",
  verifyToken,
  uploader().fields([{ name: "image", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  editEventController
);

export default router;
