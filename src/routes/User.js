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
exports.User = void 0;
const prisma_1 = require("../storage/prisma");
class User {
    static list() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.users.findMany({});
        });
    }
    static pathMe(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    gpt3_api_key: req.body.gpt3_api_key
                }
            });
        });
    }
    static getMe(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.users.findUnique({
                where: {
                    id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
                },
                select: {
                    gpt3_api_key: req.query.gpt3_api_key === '1'
                }
            });
        });
    }
}
exports.User = User;
