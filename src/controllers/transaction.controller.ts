import { NextFunction, Request, Response } from "express";
import { updateTransactionService } from "../services/transaction/update-transaction.service";
import { createTransactionService } from "../services/transaction/create-transaction.service";
import { getTransactionService } from "../services/transaction/get-transaction.service";
import { getUserTransactionsService } from "../services/transaction/get-user-transactions.service";

export const getTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getTransactionService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getUserTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(res.locals.user.id);
    const transactions = await getUserTransactionsService(userId);
    res.status(200).send(transactions);
  } catch (error) {
    next(error);
  }
};

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);

    const transaction = await createTransactionService(req.body, userId);

    res.status(201).send(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.id;
    const transactionId = parseInt(req.params.id);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

   
    if (!files?.paymentProof?.[0]) {
      res.status(400).json({
        status: "error",
        message: "Payment proof is required",
      });
      return;
    }

    const updatedTransaction = await updateTransactionService(
      transactionId,
      files.paymentProof?.[0],
      userId
    );

    res.status(201).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};
