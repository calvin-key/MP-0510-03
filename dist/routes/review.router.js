"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const review_controller_1 = require("../controllers/review.controller");
const review_validator_1 = require("../validators/review.validator");
const router = (0, express_1.Router)();
router.post("/", jwt_1.verifyToken, review_validator_1.validateReview, review_controller_1.createReviewController);
exports.default = router;
