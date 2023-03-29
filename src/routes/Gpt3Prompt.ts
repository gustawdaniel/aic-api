import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";

export class Gpt3Prompt {
    static set(req: FastifyRequest<{ Body: { id: string, value: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        if (req.body.id.length) {
            return prisma.prompts.update({
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
            return prisma.prompts.create({
                data: {
                    user_id: req.user.id,
                    value: req.body.value
                }
            })
        }
    }

    static list() {
        return prisma.prompts.findMany({})
    }

    static delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        return prisma.prompts.delete({
            where: {
                id_user_id: {
                    user_id: req.user.id,
                    id: req.params.id
                }
            }
        })
    }
}
