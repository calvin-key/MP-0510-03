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
exports.changePasswordService = void 0;
const argon_1 = require("../../lib/argon");
const argon_2 = require("../../lib/argon");
const prisma_1 = require("../../lib/prisma");
const changePasswordService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findFirst({ where: { id } });
        if (!user) {
            throw new Error("Invalid user id");
        }
        const { password, newPassword } = body;
        const isPasswordValid = yield (0, argon_2.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        const hashedPassword = yield (0, argon_1.hashPassword)(newPassword);
        yield prisma_1.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
        return { message: "Change password success" };
    }
    catch (error) {
        throw error;
    }
});
exports.changePasswordService = changePasswordService;
