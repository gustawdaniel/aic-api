import fastify, {errorCodes, FastifyInstance} from "fastify";
import {Auth} from "./routes/Auth";
import cors from '@fastify/cors'
import {Source} from "./routes/Source";
import {admin, auth, JWTUser} from "./functions/auth";
import fastifySensible from '@fastify/sensible'
import {Request} from "./routes/Request";
import {Article} from "./routes/Article";
import {Version} from "./routes/Version";
import {User} from "./routes/User";
import {ProcessingTemplate} from "./routes/ProcessingTemplate";
import {Target} from "./routes/Target";
import {AxiosError} from "axios";
import {Gpt3Controller as Gpt3} from "./routes/Gpt3";
import websocket from '@fastify/websocket';
import {ee} from "./storage/event";
import {Queue} from "./routes/Queue";
import {Gpt3Context} from "./routes/Gpt3Context";

declare module 'fastify' {
    interface FastifyRequest {
        user: JWTUser | null
    }
}

export function getFastifyServer(): FastifyInstance {
    const app = fastify({})

    app.register(websocket);

    app.register(async function (app) {
        app.get('/queue', {websocket: true}, (connection /* SocketStream */, req /* FastifyRequest */) => {
            ee.on('end', (payload: {
                id: string,
                type: string,
                progress: number
                resource_id: string
            }) => {
                console.log("send", payload);
                connection.socket.send(JSON.stringify(payload));
            })
            // connection.socket.on('close', () => {
            // });

            // connection.socket.on('message', message => {
            //     // message.toString() === 'hi from client'
            //     connection.socket.send('hi from server')
            // })
        })
    })

    app.register(cors)
    app.register(fastifySensible)

    app.setErrorHandler(function (error, request, reply) {
        if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
            // Log error
            this.log.error(error)
            // Send error response
            reply.status(500).send({ok: false})
        } else {
            if (error instanceof AxiosError) {
                console.log("ZZ > req".red, error.request.headers, error.request.url, error.request.method, error.request.data)
                console.log("ZZ > res".red, error.response?.status, error.response?.data, error.response?.headers)
            } else {
                console.log("XX".red, error)
            }
            // fastify will use parent error handler to handle this
            reply.send(error)
        }
    })

    // there add
    // - endpoints
    // - hooks
    // - middlewares
    app.get('/', Version.root)

    app.get('/source', {preValidation: [auth]}, Source.list)
    app.post('/source', {preValidation: [auth]}, Source.create)
    app.delete('/source/:id', {preValidation: [auth]}, Source.remove)

    app.get('/target', {preValidation: [auth]}, Target.list)
    app.post('/target', {preValidation: [auth]}, Target.create)
    app.delete('/target/:id', {preValidation: [auth]}, Target.remove)


    app.post('/processing-template', {preValidation: [auth]}, ProcessingTemplate.create)

    app.post('/request', {preValidation: [auth]}, Request.inject)

    app.get('/article', {preValidation: [auth]}, Article.list)
    app.get('/article/:id', {preValidation: [auth]}, Article.one)
    app.put('/article/:id', {preValidation: [auth]}, Article.update)
    app.post('/article/:articleId/publish/:targetId', {preValidation: [auth]}, Article.publish)
    app.delete('/article/:id', {preValidation: [auth]}, Article.delete)

    app.get('/user', {preValidation: [admin]}, User.list)
    app.get('/me', {preValidation: [auth]}, User.getMe)
    app.patch('/me', {preValidation: [auth]}, User.pathMe)

    // gpt3
    app.post('/ask', {preValidation: [auth]}, Gpt3.ask)

    app.post('/google-verify', Auth.googleVerify)
    app.post('/impersonate', {preValidation: [admin]}, Auth.impersonate)

    // queue
    app.post('/queue/debug', Queue.addDebug)

    // context
    app.get('/context', {preValidation: [auth]}, Gpt3Context.list)
    app.put('/context', {preValidation: [auth]}, Gpt3Context.set)
    app.delete('/context/:id', {preValidation: [auth]}, Gpt3Context.delete)

    return app
}
