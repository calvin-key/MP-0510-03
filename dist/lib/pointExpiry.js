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
exports.expirePoints = void 0;
const node_schedule_1 = require("node-schedule");
const prisma_1 = require("./prisma");
const expirePoints = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const expiredPoints = yield prisma_1.prisma.point.findMany({
            where: {
                expiredAt: { lte: now },
            },
            include: {
                user: true,
            },
        });
        for (const point of expiredPoints) {
            yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                yield tx.point.delete({
                    where: {
                        id: point.id,
                    },
                });
                yield tx.user.update({
                    where: {
                        id: point.userId,
                    },
                    data: {
                        pointsBalance: {
                            decrement: point.points,
                        },
                    },
                });
            }));
        }
        console.log(`${expiredPoints.length} expired points have been removed.`);
    }
    catch (error) {
        console.error("Error in expirePoints:", error);
    }
});
exports.expirePoints = expirePoints;
(0, node_schedule_1.scheduleJob)("0 0 * * *", expirePoints);
expirePoints().catch(console.error);
