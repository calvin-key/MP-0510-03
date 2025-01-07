"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStatisticsController = void 0;
const get_events_statistic_service_1 = require("../services/statistic/get-events-statistic.service");
const getTransactionStatisticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month, day } = req.query;
        // Validate year
        if (year && (!Number.isInteger(Number(year)) || Number(year) < 2000)) {
            res.status(400).json({ message: "Invalid year format" });
            return;
        }
        // Validate month
        if (month &&
            (!Number.isInteger(Number(month)) ||
                Number(month) < 1 ||
                Number(month) > 12)) {
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
            if (!Number.isInteger(Number(day)) ||
                Number(day) < 1 ||
                Number(day) > daysInMonth) {
                res.status(400).json({ message: "Invalid day for given month" });
                return;
            }
        }
        const statistics = yield (0, get_events_statistic_service_1.getTransactionStatisticsService)({
            userId: Number(res.locals.user.id),
            year,
            month,
            day,
        });
        res.status(200).json({
            success: true,
            data: statistics,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionStatisticsController = getTransactionStatisticsController;
