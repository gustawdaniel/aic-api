import fastify, {FastifyInstance} from "fastify";
import {Auth} from "./routes/Auth";
import cors from '@fastify/cors'
import {Source} from "./routes/Source";
import {auth, JWTUser} from "./functions/auth";
import fastifySensible from '@fastify/sensible'
import {Request} from "./routes/Request";
import {Article} from "./routes/Article";
import {Version} from "./routes/Version";

declare module 'fastify' {
    interface FastifyRequest {
        user: JWTUser | null
    }
}

export function getFastifyServer(): FastifyInstance {
    const app = fastify({})

    app.register(cors)
    app.register(fastifySensible)

    // there add
    // - endpoints
    // - hooks
    // - middlewares
    app.get('/', Version.root)
    app.get('/source', {preValidation: [auth]}, Source.list)

    app.post('/request', {preValidation: [auth]}, Request.inject)

    app.get('/article', {preValidation: [auth]}, Article.list)
    app.get('/article/:id', {preValidation: [auth]}, Article.one)
    app.put('/article/:id', {preValidation: [auth]}, Article.update)

    app.post('/google-verify', Auth.googleVerify)

    return app
}
