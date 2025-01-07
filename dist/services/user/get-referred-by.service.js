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
exports.getReferredByService = void 0;
const prisma_1 = require("../../lib/prisma");
const getReferredByService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("Invalid user id");
        }
        const userReferrer = yield prisma_1.prisma.referralHistory.findFirst({
            where: { referredId: userId },
            include: { referrer: { select: { fullName: true } } },
        });
        if (!userReferrer) {
            throw new Error("Not referred by anyone");
        }
        return {
            referredBy: userReferrer.referrer,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getReferredByService = getReferredByService;
