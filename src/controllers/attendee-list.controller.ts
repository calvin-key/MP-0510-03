import { Request, Response, NextFunction } from "express";
import { getAttendeeListService } from "../services/attendee-list/get-attendee-list.service";

export const AttendeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      take = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const eventId = parseInt(req.params.eventId);

    if (!eventId) {
      throw new Error();
    }

    const result = await getAttendeeListService({
      page: Number(page),
      take: Number(take),
      sortBy: String(sortBy),
      sortOrder: String(sortOrder).toLowerCase() as "asc" | "desc",
      eventId,
      search: search ? String(search) : undefined,
    });

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved attendee list",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};
