import 'colors-cli/toxic'

import {getFastifyServer} from './fastify'
import {setupArticleQueue} from "./storage/queue";

async function main() {
    const app = await getFastifyServer()
    const address = await app.listen({port: 4000, host: '0.0.0.0'})
    // start queue
    setupArticleQueue().catch(console.error)
    console.log(`Fastify listen on ${address}`);
}

main().catch(console.error)
