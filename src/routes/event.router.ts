import { Router } from "express";
import {
  createEventController,
  getEventsController,
} from "../controllers/event.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import { validateCreateEvent } from "../validators/event.validator";

const router = Router();

router.get("/", getEventsController);
router.post(
  "/",
  uploader(5).fields([{ name: "image", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);

export default router;
