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
exports.changePasswordController = exports.updateUserController = exports.getReferredUsersController = exports.getReferredByController = exports.getOrganizerController = exports.getUserController = void 0;
const get_user_service_1 = require("../services/user/get-user.service");
const update_user_service_1 = require("../services/user/update-user.service");
const get_referred_by_service_1 = require("../services/user/get-referred-by.service");
const get_users_referred_1 = require("../services/user/get-users-referred");
const change_password_service_1 = require("../services/user/change-password.service");
const get_organizer_service_1 = require("../services/user/get-organizer.service");
const getUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(res.locals.user.id);
        const result = yield (0, get_user_service_1.getUserService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserController = getUserController;
const getOrganizerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizerId = parseInt(req.params.id);
        if (isNaN(organizerId)) {
            res.status(400).send({
                status: "error",
                message: "Invalid organizer ID",
            });
        }
        const data = yield (0, get_organizer_service_1.getOrganizerService)(organizerId);
        res.status(200).send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrganizerController = getOrganizerController;
const getReferredByController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, get_referred_by_service_1.getReferredByService)(res.locals.user.id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getReferredByController = getReferredByController;
const getReferredUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            take: parseInt(req.query.take) || 5,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
        };
        const result = yield (0, get_users_referred_1.getReferredUsersService)(res.locals.user.id, query);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getReferredUsersController = getReferredUsersController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const result = yield (0, update_user_service_1.updateUserService)(req.body, (_a = files.profilePicture) === null || _a === void 0 ? void 0 : _a[0], res.locals.user.id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(res.locals.user.id);
        const body = req.body;
        const result = yield (0, change_password_service_1.changePasswordService)(userId, body);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.changePasswordController = changePasswordController;
