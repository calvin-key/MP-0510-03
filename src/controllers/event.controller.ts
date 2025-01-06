import { NextFunction, Request, Response } from "express";
import { createEventService } from "../services/event/create-event.service";
import { getEventService } from "../services/event/get-event.service";
import { getEventsService } from "../services/event/get-events.service";
import { getOrganizerEventsService } from "../services/event/get-organizer-events.service";
import { getReviewableEventsService } from "../services/event/get-reviewable-events.service";

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 8,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      city: (req.query.city as string) || "",
      category: (req.query.category as string) || "",
    };

    const result = await getEventsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getOrganizerEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerId = Number(res.locals.user.id);

    if (!organizerId) {
      res.status(403).send({ error: "Unauthorized access" });
      return;
    }

    const result = await getOrganizerEventsService(organizerId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewableEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const events = await getReviewableEventsService(userId);

    res.status(200).send(events);
  } catch (error) {
    next(error);
  }
};

export const getEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getEventService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }

    const event = await createEventService(
      req.body,
      files.image?.[0],
      Number(res.locals.user.id)
    );

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
};
