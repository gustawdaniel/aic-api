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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const prisma_1 = require("../storage/prisma");
const client_1 = require("@prisma/client");
const url_1 = __importDefault(require("url"));
function getType(type) {
    if (/https:\/\/businessinsider\.com\.pl/.test(type))
        return client_1.SourceType.buisnesinsider;
    if (/(https:\/\/gustawdaniel\.com)|(https:\/\/preciselab\.io)/.test(type))
        return client_1.SourceType.ghost;
    throw new Error(`Source ${type} not implemented`);
}
function fixUrl(url, type) {
    switch (type) {
        case client_1.SourceType.buisnesinsider: return url_1.default.parse(url).href + '.feed';
        case client_1.SourceType.ghost: return `https://${url_1.default.parse(url).host}/news/rss`;
    }
}
class Source {
    static list(req, reply) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.email))
                return reply.unauthorized();
            return prisma_1.prisma.sources.findMany({
                where: {
                    user_id: req.user.id
                },
                include: {
                    _count: {
                        select: {
                            requests: true
                        }
                    }
                }
            });
        });
    }
    static create(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            console.log("req.body", req.body);
            const type = getType(req.body.url);
            const url = fixUrl(req.body.url, type);
            return prisma_1.prisma.sources.create({
                data: {
                    user_id: req.user.id,
                    url,
                    type
                }
            });
        });
    }
    static remove(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.sources.deleteMany({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });
        });
    }
}
exports.Source = Source;
