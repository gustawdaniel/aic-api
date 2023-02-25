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
exports.Request = void 0;
const prisma_1 = require("../storage/prisma");
require("colors-cli/toxic");
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const getListRequest_1 = require("../functions/getListRequest");
const getAndParseArticle_1 = require("../functions/getAndParseArticle");
class Request {
    static inject(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const s = (0, dayjs_1.default)();
            const user = req.user;
            if (!user)
                return reply.unauthorized();
            const source = yield prisma_1.prisma.sources.findFirst({
                where: {
                    user_id: user.id,
                    id: req.body.source_id
                }
            });
            if (!source)
                return reply.notFound(`Source with id ${req.body.source_id} not fount`);
            const listRequest = yield (0, getListRequest_1.getListRequest)(user, source);
            const rss = source.type === client_1.SourceType.ghost ?
                listRequest.data :
                listRequest.data;
            const existingRequests = yield prisma_1.prisma.requests.findMany({
                where: {
                    url: {
                        in: rss.items.map(item => item.link)
                    }
                }
            });
            for (const url of rss.items.map(item => item.link).filter(url => !existingRequests.map(req => req.url).includes(url))) {
                let itemRequest = yield prisma_1.prisma.requests.create({
                    data: {
                        url,
                        source_id: source.id,
                        user_id: user.id,
                        type: client_1.RequestType.article,
                    }
                });
                let s = (0, dayjs_1.default)();
                const { data, html } = yield (0, getAndParseArticle_1.getAndParseArticle)(url, source.type);
                console.log(`new request in ${(0, dayjs_1.default)().diff(s)}ms`.blue);
                console.log(data);
                itemRequest = yield prisma_1.prisma.requests.update({
                    where: {
                        id: itemRequest.id
                    },
                    data: {
                        data: JSON.parse(JSON.stringify(data)),
                        html
                    }
                });
                yield prisma_1.prisma.articles.create({
                    data: {
                        user_id: user.id,
                        request_id: itemRequest.id,
                        components: data.components,
                    }
                });
            }
            console.log(`finished in ${(0, dayjs_1.default)().diff(s)}ms`.green);
            return {
                status: 'ok',
                time: (0, dayjs_1.default)().diff(s)
            };
        });
    }
}
exports.Request = Request;
