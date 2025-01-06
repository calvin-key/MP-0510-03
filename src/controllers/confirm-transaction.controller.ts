import { NextFunction, Request, Response } from "express";
import { getTransactionsByOrganizerIdService } from "../services/confirm-transaction/get-confirm-transaction.service";
import { prisma } from "../lib/prisma";

export const getTransactionsByOrganizerIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const results = await getTransactionsByOrganizerIdService(
      res.locals.user.id,
      query
    );
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const rejectTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = parseInt(req.params.id);

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "rejected" },
    });

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};
