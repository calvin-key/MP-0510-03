import { Request, Response, NextFunction } from "express";
import { getTransactionStatisticsService } from "../services/statistic/get-events-statistic.service";

export const getTransactionStatisticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { year, month, day } = req.query as {
      year?: string;
      month?: string;
      day?: string;
    };

    // Validate year
    if (year && (!Number.isInteger(Number(year)) || Number(year) < 2000)) {
      res.status(400).json({ message: "Invalid year format" });
      return;
    }

    // Validate month
    if (
      month &&
      (!Number.isInteger(Number(month)) ||
        Number(month) < 1 ||
        Number(month) > 12)
    ) {
      res.status(400).json({ message: "Invalid month format" });
      return;
    }

    // Validate day
    if (day) {
      if (!month || !year) {
        res.status(400).json({ message: "Day requires month and year" });
        return;
      }

      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      if (
        !Number.isInteger(Number(day)) ||
        Number(day) < 1 ||
        Number(day) > daysInMonth
      ) {
        res.status(400).json({ message: "Invalid day for given month" });
        return;
      }
    }

    const statistics = await getTransactionStatisticsService({
      userId: Number(res.locals.user.id),
      year,
      month,
      day,
    });

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
};
