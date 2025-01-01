import { Router } from "express";
import {
  createEventController,
  getEventController,
  getEventsController,
  getOrganizerEventsController,
} from "../controllers/event.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateCreateEvent } from "../validators/event.validator";

const router = Router();

router.get("/", getEventsController);
router.get("/organizer", getOrganizerEventsController);
router.get("/:id", getEventController);
router.post(
  "/",
  uploader(5).fields([{ name: "image", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);

export default router;
