import { NextFunction, Request, Response } from "express";
import { getUserService } from "../services/user/get-user.service";
import { updateUserService } from "../services/user/update-user.service";
import { getReferredByService } from "../services/user/get-referred-by.service";
import { getReferredUsersService } from "../services/user/get-users-referred";
import { changePasswordService } from "../services/user/change-password.service";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(res.locals.user.id);

    const result = await getUserService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getReferredByController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getReferredByService(res.locals.user.id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getReferredUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 5,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
    };

    const result = await getReferredUsersService(res.locals.user.id, query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await updateUserService(
      req.body,
      files.profilePicture?.[0],
      res.locals.user.id
    );
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
