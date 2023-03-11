import {prompts} from "@prisma/client";
import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";

async function getPrompt(value: string, user_id: string): Promise<prompts> {
    return prisma.prompts.upsert({
        where: {
            value_user_id: {
                value,
                user_id
            }
        },
        create: {
            value,
            user_id,
        },
        update: {}
    })
}


export class ProcessingTemplate {
    static async create(req: FastifyRequest<{ Body: { context: string, header: string, text: string, code: string } }>, reply: FastifyReply) {
        if (!req.user) return reply.unauthorized();
        const existing = await prisma.processing_templates.findFirst({
            where: {
                user_id: req.user.id,
                context: req.body.context,
                code_prompt: req.body.code ?? '',
                header_prompt: req.body.header ?? '',
                paragraph_prompt: req.body.text ?? ''
            }
        })
        if (existing) return existing;

        const code = await getPrompt(req.body.code, req.user.id);
        const header = await getPrompt(req.body.header, req.user.id);
        const text = await getPrompt(req.body.text, req.user.id);

        return prisma.processing_templates.create({
            data: {
                user_id: req.user.id,
                code_prompt: code.value,
                header_prompt: header.value,
                context: req.body.context,
                paragraph_prompt: text.value
            }
        })
    }
}
