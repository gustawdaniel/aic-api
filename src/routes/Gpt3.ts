import {GPT3} from "../functions/gpt";
import {prisma} from "../storage/prisma";
import {FastifyReply, FastifyRequest} from "fastify";

export class Gpt3Controller {
    static async ask(req: FastifyRequest<{Body: {text: string}}>, reply: FastifyReply) {
        if(!req.user) return reply.unauthorized();

        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                gpt3_api_key: true
            }
        });
        if(!user) return reply.notFound(`User ${req.user.id} not found`);
        if(!user.gpt3_api_key) return reply.badRequest(`No api key for this user`);

        const client = new GPT3(user.gpt3_api_key);

        const {
            message,
            finish_reason
        } = await client.ask([{
            role: 'user',
            content: req.body.text
        }]);

        return {
            message,
            finish_reason
        }
    }
}
