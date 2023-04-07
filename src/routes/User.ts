import { prisma } from "../storage/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

export class UserController {
  static async list() {
    return prisma.users.findMany({})
  }

  static async setRole(req: FastifyRequest<{
    Body: { id: string, role: 'admin' | 'hacker' | 'pro', checked: boolean }
  }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    const user = await prisma.users.findUnique({where: {id: req.body.id}});

    if (!user) return reply.notFound(`User ${ req.body.id } not found`);

    const roles = user.roles.includes(req.body.role)
      ? user.roles.filter(role => role !== req.body.role)
      : [...user.roles, req.body.role];

    return prisma.users.update({
      where: {
        id: req.body.id
      },
      data: {
        roles
      }
    })
  }

  static async pathMe(req: FastifyRequest<{ Body: { gpt3_api_key: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
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
