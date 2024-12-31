import { NextFunction, Request, Response } from "express";
import { getProfileService } from "../services/dashboard/get-profile.service";
import { changePasswordService } from "../services/dashboard/change-password.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    // const id = Number(req.params.id);

    const result = await getProfileService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const body = req.body;
    const result = await changePasswordService(userId, body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
