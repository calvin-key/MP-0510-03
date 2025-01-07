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
exports.getReferredUsersService = void 0;
const prisma_1 = require("../../lib/prisma");
const getReferredUsersService = (id, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findFirst({
            where: { id },
        });
        if (!user) {
            throw new Error("Invalid user id");
        }
        const { page, sortBy, sortOrder, take } = query;
        const referredUsers = yield prisma_1.prisma.referralHistory.findMany({
            where: { referredId: id },
            skip: (page - 1) * take,
            take: take,
            orderBy: { [sortBy]: sortOrder },
            include: { referred: { select: { fullName: true } } },
        });
        if (!referredUsers) {
            throw new Error("No users referred");
        }
        const count = yield prisma_1.prisma.referralHistory.count({
            where: { referrerId: id },
        });
        return {
            data: referredUsers,
            meta: { page, take, total: count },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getReferredUsersService = getReferredUsersService;
