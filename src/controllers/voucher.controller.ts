// src/controllers/voucher.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  createVoucherService,
  deleteVoucherService,
  getAllVouchersService,
  getEventVouchersService,
  useVoucherService,
} from "../services/dashboard/voucher.service";

export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createVoucherService(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const getAllVouchersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllVouchersService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getEventVouchersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const result = await getEventVouchersService(eventId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const useVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await useVoucherService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteVoucherService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
