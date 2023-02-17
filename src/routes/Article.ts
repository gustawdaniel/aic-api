import {ArticleState} from "@prisma/client";
import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";

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

    static async one(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
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

    static async update(req: FastifyRequest<{ Body: { state: ArticleState }, Params: { id: string } }>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();

        if(req.body.state === 'queued') {
            // TODO: implement later
        }

        return prisma.articles.update({
            where: {
                id: req.params.id
            },
            data: {
                state: req.body.state
            }
        })
    }
}
