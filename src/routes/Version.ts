import pJson from '../../package.json'
import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";

export class Version {
    static async root(_: FastifyRequest,reply: FastifyReply) {
        const errors = await prisma.error_logs.count({
            where: {
                resolved: false
            }
        });

        if(errors) {
            return reply.internalServerError(`Found ${errors} unresolved errors`);
        }

        return {
            name: pJson.name,
            version: pJson.version,
        }
    }
}
