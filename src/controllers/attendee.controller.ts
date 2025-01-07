import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getAttendeesByEventService } from "../services/attendee/get-attendees.service";

export const getAttendeesByEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = Number(req.params.eventId);

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const userId = res.locals.user.id;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true },
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.userId !== userId) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }

    const attendees = await getAttendeesByEventService(eventId);
    res.status(200).json(attendees);
  } catch (error) {
    next(error);
  }
};
