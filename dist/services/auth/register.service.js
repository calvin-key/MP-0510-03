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
exports.registerService = void 0;
const argon_1 = require("../../lib/argon");
const referral_1 = require("../../lib/referral");
const coupon_1 = require("../../lib/coupon");
const prisma_1 = require("../../lib/prisma");
const registerService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, referralCode, role } = body;
        // Check if email exists
        const existingUser = yield prisma_1.prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email already exist");
        }
        const normalizedReferralCode = referralCode === null || referralCode === void 0 ? void 0 : referralCode.toLowerCase();
        let referrer = null;
        if (normalizedReferralCode) {
            referrer = yield prisma_1.prisma.user.findUnique({
                where: {
                    referralCode: normalizedReferralCode,
                },
            });
            if (!referrer) {
                throw new Error("Invalid referral code!");
                throw new Error("Invalid referral code!");
            }
        }
        const hashedPassword = yield (0, argon_1.hashPassword)(password);
        const userReferralCode = (0, referral_1.generateReferralCode)();
        // Set points expiry date to 3 months from now
        const pointsExpiryDate = new Date();
        pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);
        // Create new user
        const newUser = yield prisma_1.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                referralCode: userReferralCode,
                role,
                phoneNumber: "",
                pointsBalance: 0,
                pointsExpiryDate,
            },
        });
        // If user registered with referral code
        if (referrer) {
            // Create referral history
            yield prisma_1.prisma.referralHistory.create({
                data: {
                    referrerId: referrer.id,
                    referredId: newUser.id,
                    pointsAwarded: 10000,
                },
            });
            // Add points to referrer
            yield prisma_1.prisma.point.create({
                data: {
                    userId: referrer.id,
                    points: 10000,
                    expiredAt: pointsExpiryDate,
                },
            });
            // Update referrer's points balance
            yield prisma_1.prisma.user.update({
                where: { id: referrer.id },
                data: {
                    pointsBalance: {
                        increment: 10000,
                    },
                },
            });
            // Generate and create coupon for the new user
            const couponExpiryDate = new Date();
            couponExpiryDate.setMonth(couponExpiryDate.getMonth() + 3);
            const couponCode = yield (0, coupon_1.generateUniqueCouponCode)();
            const coupon = yield prisma_1.prisma.coupon.create({
                data: {
                    code: couponCode,
                    nominal: 50000,
                    expiredAt: couponExpiryDate, // Add expiration date
                    isUsed: false, // Add isDeleted field
                },
            });
            // Create user-coupon relationship
            yield prisma_1.prisma.userCoupon.create({
                data: {
                    userId: newUser.id,
                    couponId: coupon.id,
                    isUsed: false, // Add isUsed field
                },
            });
        }
        // Return user with included relationships
        const userWithRelations = yield prisma_1.prisma.user.findUnique({
            where: { id: newUser.id },
            include: {
                userCoupons: {
                    include: {
                        coupon: true,
                    },
                },
            },
        });
        return userWithRelations;
    }
    catch (error) {
        throw error;
    }
});
exports.registerService = registerService;
