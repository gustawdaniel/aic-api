import { FastifyReply, FastifyRequest } from "fastify";

export async function serverTimingEnd(request: FastifyRequest, reply: FastifyReply) {
  const end = process.hrtime(request.serverTimingStart);
  const duration = ((end[0] * 1e9 + end[1]) / 1e6).toFixed(2); // duration in milliseconds

  const headers = {
    'Server-Timing': `total;dur=${duration}`
  };

  reply.headers(headers);
}
