import {ArticleState} from "@prisma/client";
import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";
import {Wordpress} from "../platforms/Wordpress";
import {getArticleHtmlContent, getArticleTitle} from "../functions/getArticleTitle";
import {Ghost} from "../platforms/Ghost";
import {processArticleQueue} from "../storage/queue";
import {uid} from "uid";

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

    static async update(req: FastifyRequest<{ Body: { state: ArticleState, processing_template_id?: string, queue_id?: string }, Params: { id: string } }>, reply: FastifyReply) {
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
            await processArticleQueue.push({article_id: req.params.id, gpt3_api_key: user.gpt3_api_key ?? '', queue_id: req.body.queue_id ?? uid(), progress: 0})
            console.log("pushed");
        }

        return prisma.articles.update({
            where: {
                id: req.params.id
            },
            data: {
                state: req.body.state,
                processing_template_id: req.body.processing_template_id
            }
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
                const response = await new Wordpress(target.url, {
                    username: target.auth.username ?? '',
                    password: target.auth.password ?? ''
                }).publish(title, content);
                console.log(response);
                break;
            }
            case 'ghost': {
                console.log("art", article.components);
                console.log("content", content);
                const response = await new Ghost(target.url, target.auth.key ?? '').publish(title, content)
                console.log(response);
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

    static delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        return prisma.articles.delete({
            where: {
                id_user_id: {
                    user_id: req.user.id,
                    id: req.params.id
                }
            }
        })
    }
}
