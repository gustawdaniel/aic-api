import { errorCodes, FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AxiosError } from "axios";

export function logAxiosErrorToConsole(error: AxiosError) {
  console.log("ZZ > req".red, error.request.headers, error.request.url, error.request.method, error.request.data)
  console.log("ZZ > res".red, error.response?.status, error.response?.data, error.response?.headers)
}

export function errorHandlerGenerator(app: FastifyInstance) {
  function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
      // Log error
      app.log.error(error)
      // Send error response
      reply.status(500).send({ok: false})
    } else {
      if (error instanceof AxiosError) {
        logAxiosErrorToConsole(error);
      } else {
        console.log("XX".red, error)
      }
      // fastify will use parent error handler to handle this
      reply.send(error)
    }
  }

  return errorHandler;
}

