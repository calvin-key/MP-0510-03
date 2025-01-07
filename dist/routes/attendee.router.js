"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../lib/jwt");
const attendee_controller_1 = require("../controllers/attendee.controller");
const router = (0, express_1.Router)();
router.get("/:eventId", jwt_1.verifyToken, attendee_controller_1.getAttendeesByEventController);
exports.default = router;
