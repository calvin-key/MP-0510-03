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
exports.updateUserService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
const updateUserService = (body, profilePicture, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(body, profilePicture, id);
        const user = yield prisma_1.prisma.user.findFirst({
            where: { id },
        });
        if (!user) {
            throw new Error("Invalid user id");
        }
        let secure_url;
        if (profilePicture) {
            if (user.profilePicture !== null) {
                yield (0, cloudinary_1.cloudinaryRemove)(user.profilePicture);
            }
            const uploadResult = yield (0, cloudinary_1.cloudinaryUpload)(profilePicture);
            secure_url = uploadResult.secure_url;
        }
        yield prisma_1.prisma.user.update({
            where: { id },
            data: secure_url ? Object.assign(Object.assign({}, body), { profilePicture: secure_url }) : body,
        });
        return { message: "Update profile success" };
    }
    catch (error) {
        throw error;
    }
});
exports.updateUserService = updateUserService;
