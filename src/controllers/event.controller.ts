import { NextFunction, Request, Response } from "express";
import { getEventsService } from "../services/event/get-events.service";
import { createEventService } from "../services/event/create-event.service";
import { getEventService } from "../services/event/get-event.service";

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
      1
      // res.locals.user.id // User ID from token
    );

    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
};
