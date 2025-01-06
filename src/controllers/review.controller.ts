import { NextFunction, Request, Response } from "express";
import { createReviewService } from "../services/review/create-review.service";

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, rating, comment } = req.body;
    const userId = Number(res.locals.user.id);

    const review = await createReviewService(userId, eventId, rating, comment);
    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
};
