import { Request, Response } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";

export const createVoucherController = async (req: Request, res: Response) => {
  try {
    const organizerId = Number(res.locals.user.id);
    const voucher = await createVoucherService(organizerId, req.body);

    res.status(201).json({ message: "Voucher created successfully.", voucher });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
