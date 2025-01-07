"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
router.post("/validate", jwt_1.verifyToken, coupon_controller_1.validateCouponController);
exports.default = router;
