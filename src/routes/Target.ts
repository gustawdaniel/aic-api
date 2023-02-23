import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";
import {z} from "zod";
import {TargetType} from "@prisma/client";

export class Target {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();

        return prisma.targets.findMany({
            where: {
                user_id: req.user.id
            }
        })
    }

    static async create(req: FastifyRequest<{
        Body: {
            url: string,
            type: TargetType
            auth: {
                username?: string,
                password?: string,
                key?: string
            }
        }
    }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();

        const Target = z.object({
            url: z.string(),
            type: z.enum(['wordpress', 'ghost']),
            auth: z.object({
                username: z.string().optional(),
                password: z.string().optional(),
                key: z.string().optional(),
            })
        });

        Target.parse(req.body)

        return prisma.targets.create({
            data: {
                user_id: req.user.id,
                url: req.body.url,
                type: req.body.type,
                auth: req.body.auth,
            }
        })
    }

    static async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();
        return prisma.targets.deleteMany({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
    }
}
