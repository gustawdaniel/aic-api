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
exports.Target = void 0;
const prisma_1 = require("../storage/prisma");
const zod_1 = require("zod");
class Target {
    static list(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.targets.findMany({
                where: {
                    user_id: req.user.id
                }
            });
        });
    }
    static create(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            const Target = zod_1.z.object({
                url: zod_1.z.string(),
                type: zod_1.z.enum(['wordpress', 'ghost']),
                auth: zod_1.z.object({
                    username: zod_1.z.string().optional(),
                    password: zod_1.z.string().optional(),
                    key: zod_1.z.string().optional(),
                })
            });
            Target.parse(req.body);
            return prisma_1.prisma.targets.create({
                data: {
                    user_id: req.user.id,
                    url: req.body.url,
                    type: req.body.type,
                    auth: req.body.auth,
                }
            });
        });
    }
    static remove(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.targets.deleteMany({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });
        });
    }
}
exports.Target = Target;
