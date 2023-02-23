import {ArticleState} from "@prisma/client";
import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";
import {push, ZeroMessage} from "../storage/zero";

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
}
