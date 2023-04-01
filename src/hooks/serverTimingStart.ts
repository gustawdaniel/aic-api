import { FastifyReply, FastifyRequest } from "fastify";

export async function serverTimingStart(request: FastifyRequest) {
  request.serverTimingStart = process.hrtime();
}
