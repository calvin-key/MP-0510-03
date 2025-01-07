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
exports.validateCouponService = void 0;
const prisma_1 = require("../../lib/prisma");
const validateCouponService = (code, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First check if coupon exists
        const coupon = yield prisma_1.prisma.coupon.findFirst({
            where: { code },
        });
        if (!coupon) {
            throw new Error("Coupon not found");
        }
        // Check if coupon is expired
        if (coupon.expiredAt < new Date()) {
            throw new Error("Coupon has expired");
        }
        // Check if user owns this coupon
        const userCoupon = yield prisma_1.prisma.userCoupon.findFirst({
            where: {
                userId,
                couponId: coupon.id,
            },
            include: {
                coupon: true,
            },
        });
        if (!userCoupon) {
            throw new Error("This coupon doesn't belong to you");
        }
        // Check if coupon is already used
        if (userCoupon.isUsed) {
            throw new Error("This coupon has already been used");
        }
        return {
            id: userCoupon.couponId,
            code: userCoupon.coupon.code,
            nominal: userCoupon.coupon.nominal,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.validateCouponService = validateCouponService;
