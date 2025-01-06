import { NextFunction, Request, Response } from "express";

export const validateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    res.status(400).send({ message: "Rating must be between 1 and 5" });
    return;
  }

  if (!comment || comment.trim().length < 10) {
    res
      .status(400)
      .send({ message: "Review must be at least 10 characters long" });
    return;
  }

  next();
};
