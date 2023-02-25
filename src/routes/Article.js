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
exports.Article = void 0;
const prisma_1 = require("../storage/prisma");
const zero_1 = require("../storage/zero");
const Wordpress_1 = require("../platforms/Wordpress");
const getArticleTitle_1 = require("../functions/getArticleTitle");
const Ghost_1 = require("../platforms/Ghost");
class Article {
    static list(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.articles.findMany({
                where: {
                    user_id: req.user.id,
                },
                include: {
                    request: {
                        select: {
                            url: true,
                            created_at: true
                        }
                    }
                }
            });
        });
    }
    static one(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            return prisma_1.prisma.articles.findFirst({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                },
                include: {
                    request: {
                        select: {
                            url: true,
                            created_at: true
                        }
                    }
                }
            });
        });
    }
    static update(req, reply) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            if (req.body.state === 'queued' && !req.body.processing_template_id) {
                return reply.badRequest(`For queued articles you have to set processing_template_id`);
            }
            const user = yield prisma_1.prisma.users.findUnique({
                where: {
                    id: req.user.id
                },
                select: {
                    gpt3_api_key: true
                }
            });
            if (!user)
                return reply.unauthorized();
            if (req.body.state === 'queued') {
                if (!user.gpt3_api_key) {
                    return reply.unprocessableEntity(`You have to add gpt3_api_key to your account`);
                }
                console.log("pushing");
                yield (0, zero_1.push)(new zero_1.ZeroMessage(req.params.id, (_a = user.gpt3_api_key) !== null && _a !== void 0 ? _a : ''));
                console.log("pushed");
            }
            return prisma_1.prisma.articles.update({
                where: {
                    id: req.params.id
                },
                data: req.body
            });
        });
    }
    static publish(req, reply) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(1);
            const article = yield prisma_1.prisma.articles.findUnique({
                where: {
                    id: req.params.articleId
                }
            });
            console.log("a", article);
            if (!article)
                return reply.notFound();
            console.log(2);
            const target = yield prisma_1.prisma.targets.findUnique({
                where: {
                    id: req.params.targetId
                }
            });
            console.log("t", target);
            if (!target)
                return reply.notFound();
            const title = (0, getArticleTitle_1.getArticleTitle)(article);
            const content = (0, getArticleTitle_1.getArticleHtmlContent)(article);
            switch (target.type) {
                case 'wordpress': {
                    yield new Wordpress_1.Wordpress(target.url, {
                        username: (_a = target.auth.username) !== null && _a !== void 0 ? _a : '',
                        password: (_b = target.auth.password) !== null && _b !== void 0 ? _b : ''
                    }).publish(title, content);
                    break;
                }
                case 'ghost': {
                    console.log("art", article.components);
                    console.log("content", content);
                    yield new Ghost_1.Ghost(target.url, (_c = target.auth.key) !== null && _c !== void 0 ? _c : '').publish(title, content);
                    break;
                }
                default: {
                    return reply.badRequest('Target type disallowed. Possible are ghost and wordpress');
                }
            }
            yield prisma_1.prisma.articles.update({
                where: {
                    id: article.id
                },
                data: {
                    state: 'published'
                }
            });
            return { status: 'success' };
        });
    }
}
exports.Article = Article;
