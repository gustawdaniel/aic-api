import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";

export class UserController {
    static async list() {
        return prisma.users.findMany({})
    }

    static async pathMe(req: FastifyRequest<{ Body: { gpt3_api_key: string } }>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();
        return prisma.users.update({
            where: {
                id: req.user.id
            },
            data: {
                gpt3_api_key: req.body.gpt3_api_key
            }
        })
    }

    static async getMe(req: FastifyRequest<{ Querystring: { gpt3_api_key: string } }>) {
        return prisma.users.findUnique({
            where: {
                id: req.user?.id
            },
            select: {
                gpt3_api_key: req.query.gpt3_api_key === '1'
            }
        })
    }
}
