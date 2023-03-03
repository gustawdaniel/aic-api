import 'colors-cli/toxic'

import {getFastifyServer} from './fastify'
import {pull} from "./storage/zero";

async function main() {
    const app = await getFastifyServer()
    await app.listen({port: 4000, host: '0.0.0.0'})
    // start queue
    pull().catch(console.error)
    console.log(`Fastify listen on http://localhost:4000/`);
}

main().catch(console.error)
