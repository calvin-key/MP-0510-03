import { Request, Response, NextFunction } from "express";
import { getEventsStatisticsService } from "../services/statistic/get-events-statistic.service";

export const getEventsStatisticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = req.query.year as string | undefined;
    const month = req.query.month as string | undefined;
    const day = req.query.day as string | undefined;

    if (year && (!Number.isInteger(Number(year)) || Number(year) < 1900)) {
      res.status(400).json({ message: "Invalid year parameter" });
      return;
    }

    if (
      month &&
      (!Number.isInteger(Number(month)) ||
        Number(month) < 1 ||
        Number(month) > 12)
    ) {
      res.status(400).json({ message: "Invalid month parameter" });
      return;
    }

    if (day) {
      if (!year || !month) {
        res
          .status(400)
          .json({
            message: "Year and month are required when specifying a day",
          });
        return;
      }

      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      if (
        !Number.isInteger(Number(day)) ||
        Number(day) < 1 ||
        Number(day) > daysInMonth
      ) {
        res.status(400).json({ message: "Invalid day parameter" });
        return;
      }
    }

    const userId = res.locals.user.id;
    const statistics = await getEventsStatisticsService({
      userId,
      year,
      month,
      day,
    });

    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
};
