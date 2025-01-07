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
exports.getEventCategoriesService = void 0;
const prisma_1 = require("../../lib/prisma");
const getEventCategoriesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = query;
        const whereClause = {};
        if (search) {
            whereClause.name = { contains: search, mode: "insensitive" };
        }
        const eventCategories = yield prisma_1.prisma.category.findMany({
            where: whereClause,
            orderBy: {
                name: "asc",
            },
        });
        const count = yield prisma_1.prisma.category.count({ where: whereClause });
        return {
            data: eventCategories,
            meta: { total: count },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getEventCategoriesService = getEventCategoriesService;
