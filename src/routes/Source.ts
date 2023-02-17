import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";
import {RequestType} from "@prisma/client";

export class Source {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        if (!req.user?.email) return reply.unauthorized();

        return prisma.sources.findMany({
            where: {
                user_id: req.user.id
            },
            // select: {
            //     url: true,
            //     type: true
            // },
            include: {
                _count: {
                    select: {
                        requests: true
                    }
                }
            }
        })
    }
}
