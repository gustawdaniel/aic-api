import {ArticleState} from "@prisma/client";
import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";
import {push, ZeroMessage} from "../storage/zero";
import {Wordpress} from "../platforms/Wordpress";
import {getArticleHtmlContent, getArticleTitle} from "../functions/getArticleTitle";
import {Ghost} from "../platforms/Ghost";

export class Article {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        return prisma.articles.findMany({
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
        })
    }

    static async one(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        return prisma.articles.findFirst({
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
        })
    }

    static async update(req: FastifyRequest<{ Body: { state: ArticleState, processing_template_id?: string }, Params: { id: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();

        if (req.body.state === 'queued' && !req.body.processing_template_id) {
            return reply.badRequest(`For queued articles you have to set processing_template_id`)
        }

        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                gpt3_api_key: true
            }
        });
        if (!user) return reply.unauthorized();

        if (req.body.state === 'queued') {
            if(!user.gpt3_api_key) {
                return reply.unprocessableEntity(`You have to add gpt3_api_key to your account`);
            }
            console.log("pushing");
            await push(new ZeroMessage(req.params.id, user.gpt3_api_key ?? ''))
            console.log("pushed");
        }

        return prisma.articles.update({
            where: {
                id: req.params.id
            },
            data: req.body
        })
    }

    static async publish(req: FastifyRequest<{ Params: { articleId: string, targetId: string } }>, reply: FastifyReply) {
        console.log(1);
        const article = await prisma.articles.findUnique({
            where: {
                id: req.params.articleId
            }
        });
        console.log("a", article);
        if (!article) return reply.notFound();
        console.log(2);
        const target = await prisma.targets.findUnique({
            where: {
                id: req.params.targetId
            }
        });
        console.log("t", target);
        if (!target) return reply.notFound();

        const title = getArticleTitle(article);
        const content = getArticleHtmlContent(article);

        switch (target.type) {
            case 'wordpress': {
                await new Wordpress(target.url, {
                    username: target.auth.username ?? '',
                    password: target.auth.password ?? ''
                }).publish(title, content);
                break;
            }
            case 'ghost': {
                console.log("art", article.components);
                console.log("content", content);
                await new Ghost(target.url, target.auth.key ?? '').publish(title, content)
                break;
            }
            default: {
                return reply.badRequest('Target type disallowed. Possible are ghost and wordpress');
            }
        }

        await prisma.articles.update({
            where: {
                id: article.id
            },
            data: {
                state: 'published'
            }
        })

        return {status: 'success'}

    }
}
