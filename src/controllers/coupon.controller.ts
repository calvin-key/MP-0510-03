import { NextFunction, Request, Response } from "express";
import { validateCouponService } from "../services/coupon/validate-coupon.service";

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
