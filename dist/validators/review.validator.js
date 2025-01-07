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
exports.validateReview = void 0;
const validateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
        res.status(400).send({ message: "Rating must be between 1 and 5" });
        return;
    }
    if (!comment || comment.trim().length < 10) {
        res
            .status(400)
            .send({ message: "Review must be at least 10 characters long" });
        return;
    }
    next();
});
exports.validateReview = validateReview;
