import { Request, Response, NextFunction } from "express";
import { TransactionStatus } from "@prisma/client";
import { updateTransactionStatusService } from "../services/update-transaction-status/update-transaction-status.service";
import { getTransactionsByOrganizerIdService } from "../services/update-transaction-status/get-transaction-by-organizer-id.service";

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
      Number(res.locals.user.id),
      query
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

export const updateTransactionStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId } = req.params;
    const { status, notes } = req.body;

    const result = await updateTransactionStatusService(
      parseInt(transactionId),
      status
    );

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
