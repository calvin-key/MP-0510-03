"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/statistics.routes.ts
const express_1 = require("express");
const statistic_controller_1 = require("../controllers/statistic.controller");
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
router.get("/transactions", jwt_1.verifyToken, statistic_controller_1.getTransactionStatisticsController);
exports.default = router;
