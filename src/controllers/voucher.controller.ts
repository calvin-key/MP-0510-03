import { NextFunction, Request, Response } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";

export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerId = Number(res.locals.user.id);
    const voucher = await createVoucherService(organizerId, req.body);

    res.status(201).send({ message: "Voucher created successfully.", voucher });
  } catch (error: any) {
    next(error);
  }
};
