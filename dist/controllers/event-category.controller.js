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
exports.createEventCategoriesController = exports.getEventCategoriesController = void 0;
const create_event_category_service_1 = require("../services/event-category/create-event-category.service");
const get_event_categories_service_1 = require("../services/event-category/get-event-categories.service");
const getEventCategoriesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search || "",
        };
        const events = yield (0, get_event_categories_service_1.getEventCategoriesService)(query);
        res.status(200).json(events);
    }
    catch (error) {
        next(error);
    }
});
exports.getEventCategoriesController = getEventCategoriesController;
const createEventCategoriesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, create_event_category_service_1.createEventCategoryService)(req.body);
        res.status(201).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createEventCategoriesController = createEventCategoriesController;
