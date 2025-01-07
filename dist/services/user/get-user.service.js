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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserService = void 0;
const prisma_1 = require("../../lib/prisma");
const getUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findFirst({
            where: { id },
            include: {
                userCoupons: {
                    include: {
                        coupon: true,
                    },
                },
                points: {
                    orderBy: {
                        expiredAt: "desc",
                    },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw new Error("Invalid user id");
        }
        const { password: pass } = user, userWithoutPassword = __rest(user, ["password"]);
        // Calculate total points balance
        const pointsBalance = yield prisma_1.prisma.point.aggregate({
            where: {
                userId: id,
                expiredAt: {
                    gt: new Date(),
                },
            },
            _sum: {
                points: true,
            },
        });
        // Get latest points expiry date
        const latestPoint = user.points[0];
        return Object.assign(Object.assign({}, userWithoutPassword), { pointsBalance: pointsBalance._sum.points || 0, pointsExpiryDate: (latestPoint === null || latestPoint === void 0 ? void 0 : latestPoint.expiredAt) || new Date(), userCoupons: user.userCoupons.map((uc) => (Object.assign(Object.assign({}, uc), { coupon: Object.assign(Object.assign({}, uc.coupon), { nominal: Number(uc.coupon.nominal) }) }))) });
    }
    catch (error) {
        throw error;
    }
});
exports.getUserService = getUserService;
