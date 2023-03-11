import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";

export class Gpt3Context {
    static set(req: FastifyRequest<{ Body: { id: string, value: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        if (req.body.id.length) {
            return prisma.contexts.update({
                where: {
                    id_user_id: {
                        user_id: req.user?.id,
                        id: req.body.id
                    }
                },
                data: {
                    value: req.body.value
                }
            })
        } else {
            return prisma.contexts.create({
                data: {
                    user_id: req.user.id,
                    value: req.body.value
                }
            })
        }
    }

    static list() {
        return prisma.contexts.findMany({})
    }

    static delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        return prisma.contexts.delete({
            where: {
                id_user_id: {
                    user_id: req.user.id,
                    id: req.params.id
                }
            }
        })
    }
}
