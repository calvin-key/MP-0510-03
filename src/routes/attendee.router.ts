import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { getAttendeesByEventController } from "../controllers/attendee.controller";

const router = Router();

router.get("/:eventId", verifyToken, getAttendeesByEventController);

export default router;
