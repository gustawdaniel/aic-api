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
exports.getListRequest = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../storage/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
const rss_to_json_1 = require("rss-to-json");
function getListRequest(user, source) {
    return __awaiter(this, void 0, void 0, function* () {
        let request = yield prisma_1.prisma.requests.findFirst({
            where: {
                user_id: user.id,
                type: client_1.RequestType.list,
                source_id: source.id,
                created_at: {
                    gte: (0, dayjs_1.default)().subtract(6, 'h').toDate()
                }
            }
        });
        if (!request) {
            request = yield prisma_1.prisma.requests.create({
                data: {
                    user_id: user.id,
                    type: client_1.RequestType.list,
                    source_id: source.id,
                    url: source.url
                }
            });
            let s = (0, dayjs_1.default)();
            const rss = yield (0, rss_to_json_1.parse)(source.url);
            console.log(`new request in ${(0, dayjs_1.default)().diff(s)}ms`.blue);
            request = yield prisma_1.prisma.requests.update({
                where: {
                    id: request.id
                },
                data: {
                    data: rss,
                    response_at: (0, dayjs_1.default)().toDate()
                }
            });
        }
        return request;
    });
}
exports.getListRequest = getListRequest;
