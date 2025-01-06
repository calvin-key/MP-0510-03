import { NextFunction, Request, Response } from "express";
import { createCouponService } from "../services/coupon/create-coupon.service";
import { getCouponsService } from "../services/coupon/get-coupons.service";
import { updateCouponService } from "../services/coupon/update-coupon.service";
import { getCouponService } from "../services/coupon/get-coupon.service";
import { validateCouponService } from "../services/coupon/validate-coupon.service";

export const getCouponsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      search: (req.query.search as string) || "",
      userId: parseInt(req.query.userId as string) || 0,
    };

    const result = await getCouponsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getCouponService(parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createCouponService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await updateCouponService(req.body, parseInt(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const validateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = Number(res.locals.user.id);

    const coupon = await validateCouponService(code, userId);

    res.status(200).send(coupon);
  } catch (error) {
    next(error);
  }
};
