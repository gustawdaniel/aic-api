import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../storage/prisma";
import { Prisma } from "@prisma/client";

export class ErrorController {
  static async list(req: FastifyRequest<{ Querystring: { stack: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    const where: Prisma.error_logsWhereInput = {};

    if (req.query.stack) where.stack = req.query.stack;

    return prisma.error_logs.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 10,
      where
    })
  }

  static async types(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    return prisma.error_logs.groupBy({
      by: ['stack'],
      _count: {
        _all: true
      }
    })
  }

  static async removeByStack(req: FastifyRequest<{ Params: { stack: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    console.log("req.params.stack", req.params.stack);

    if(!req.params.stack) return reply.badRequest("stack is required");

    return prisma.error_logs.deleteMany({
      where: {
        stack: req.params.stack
      }
    })
  }
}
