import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";
import {SourceType} from "@prisma/client";
import Url from 'url'

export function getType(type: string): SourceType {
    if(/https:\/\/businessinsider\.com\.pl/.test(type)) return SourceType.buisnesinsider;
    if(/(https:\/\/gustawdaniel\.com)|(https:\/\/preciselab\.io)/.test(type)) return SourceType.ghost;
    throw new Error(`Source ${type} not implemented`);
}

export function fixUrl(url: string, type: SourceType): string {
    switch (type) {
        case SourceType.buisnesinsider: return Url.parse(url).href.replace(/\.feed$/,'') + '.feed';
        case SourceType.ghost: {
            const parsed = Url.parse(url);
            return `https://${parsed.host ?? parsed.href}/news/rss`;
        }
    }
}

export class Source {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        if (!req.user?.email) return reply.unauthorized();

        return prisma.sources.findMany({
            where: {
                user_id: req.user.id
            },
            include: {
                _count: {
                    select: {
                        requests: true
                    }
                }
            }
        })
    }

    static async create(req: FastifyRequest<{Body: {url: string}}>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();

        const type = getType(req.body.url);
        const url = fixUrl(req.body.url, type);

        return prisma.sources.create({
            data: {
                user_id: req.user.id,
                url,
                type
            }
        })
    }

    static async remove(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();
        const {count} = await prisma.sources.deleteMany({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });
        if(count) {
            return reply.status(200).send({count})
        } else {
            return reply.notFound()
        }
    }
}
