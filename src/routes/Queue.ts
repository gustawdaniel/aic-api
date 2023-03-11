import {debugQueue} from "../storage/queue";
import {FastifyRequest} from "fastify";

export class Queue {
    static async addDebug(req: FastifyRequest<{Body: {id: string, wait: number}}>) {
        debugQueue.push({
            id: req.body.id,
            wait: req.body.wait,
            type: 'debug',
            progress: 0
        })

        return {
            status: 'queued'
        }
    }
}
