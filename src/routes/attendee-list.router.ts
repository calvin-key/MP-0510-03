import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { AttendeeController } from "../controllers/attendee-list.controller";

const router = Router();

router.get("/events/:eventId/attendees", verifyToken, AttendeeController);

export default router;
