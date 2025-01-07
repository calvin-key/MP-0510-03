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
exports.editEventController = exports.createEventController = exports.getEventController = exports.getReviewableEventsController = exports.getOrganizerEventsController = exports.getEventsController = void 0;
const create_event_service_1 = require("../services/event/create-event.service");
const get_event_service_1 = require("../services/event/get-event.service");
const get_events_service_1 = require("../services/event/get-events.service");
const get_organizer_events_service_1 = require("../services/event/get-organizer-events.service");
const get_reviewable_events_service_1 = require("../services/event/get-reviewable-events.service");
const edit_event_service_1 = require("../services/event/edit-event.service");
const getEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 8,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search || "",
            city: req.query.city || "",
            category: req.query.category || "",
        };
        const result = yield (0, get_events_service_1.getEventsService)(query);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventsController = getEventsController;
const getOrganizerEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizerId = Number(res.locals.user.id);
        if (!organizerId) {
            res.status(403).send({ error: "Unauthorized access" });
            return;
        }
        const result = yield (0, get_organizer_events_service_1.getOrganizerEventsService)(organizerId);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrganizerEventsController = getOrganizerEventsController;
const getReviewableEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        const events = yield (0, get_reviewable_events_service_1.getReviewableEventsService)(userId);
        res.status(200).send(events);
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewableEventsController = getReviewableEventsController;
const getEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, get_event_service_1.getEventService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventController = getEventController;
const createEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        if (typeof req.body.categories === "string") {
            req.body.categories = JSON.parse(req.body.categories);
        }
        const event = yield (0, create_event_service_1.createEventService)(req.body, (_a = files.image) === null || _a === void 0 ? void 0 : _a[0], Number(res.locals.user.id));
        res.status(200).send(event);
    }
    catch (error) {
        next(error);
    }
});
exports.createEventController = createEventController;
const editEventController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const result = yield (0, edit_event_service_1.editEventService)(req.body, (_a = files.image) === null || _a === void 0 ? void 0 : _a[0], res.locals.user.id, Number(req.params.id));
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.editEventController = editEventController;
