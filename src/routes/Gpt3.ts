import { GPT3, GptSimpleResponse } from "../functions/gpt";
import { prisma } from "../storage/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { Gpt3Message } from "../functions/backoff";

export class Gpt3Controller {
  static async ask(req: FastifyRequest<{ Body: { messages: Gpt3Message[] } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    const user = await prisma.users.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        gpt3_api_key: true
      }
    });
    if (!user) return reply.notFound(`User ${ req.user.id } not found`);
    if (!user.gpt3_api_key) return reply.badRequest(`No api key for this user`);

    const client = new GPT3(user.gpt3_api_key);

    const {
      id,
      message,
      finish_reason,
    } = await client.ask(req.body.messages);

    return {
      id,
      message,
      finish_reason
    }
  }

  static async getAiRequest(req: FastifyRequest<{ Querystring: { ids: string[] } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    const requests = await prisma.ai_requests.findMany({
      where: {
        id: {
          in: req.query.ids
        }
      }
    });

    return requests.map((r):[string, Gpt3Message[]] => {
      return [r.id, [...r.messages, r.choices[0].message]];
    });
  }
}
