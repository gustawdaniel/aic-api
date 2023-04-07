import fastify, { FastifyInstance } from "fastify";
import { Auth } from "./routes/Auth";
import cors from '@fastify/cors'
import { admin, auth, JWTUser } from "./functions/auth";
import fastifySensible from '@fastify/sensible'
import { ArticleController as Article } from "./routes/Article";
import { Version } from "./routes/Version";
import { UserController as User } from "./routes/User";
import { ProcessingTemplate } from "./routes/ProcessingTemplate";
import { Target } from "./routes/Target";
import { Gpt3Controller as Gpt3 } from "./routes/Gpt3";
import websocket from '@fastify/websocket';
import { ee } from "./storage/event";
import { Queue } from "./routes/Queue";
import { Gpt3Context } from "./routes/Gpt3Context";
import { Gpt3Prompt } from "./routes/Gpt3Prompt";
import { Health } from "./routes/Health";
import { serverTimingStart } from "./hooks/serverTimingStart";
import { serverTimingEnd } from "./hooks/serverTimingEnd";
import {  errorHandlerGenerator } from "./hooks/errorHandler";
import { ErrorController } from "./routes/ErrorController";

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTUser | null,
    serverTimingStart: [number, number]
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

  app.addHook('onRequest', serverTimingStart);
  app.addHook('onSend', serverTimingEnd);

  app.setErrorHandler(errorHandlerGenerator(app))

  // there add
  // - endpoints
  // - hooks
  // - middlewares
  app.get('/', Version.root)
  app.get('/health', Health.root)

  // TODO: move

  // app.get('/source', {preValidation: [auth]}, Source.list)
  // app.post('/source', {preValidation: [auth]}, Source.create)
  // app.delete('/source/:id', {preValidation: [auth]}, Source.remove)
  // app.post('/request', {preValidation: [auth]}, Request.inject)

  app.get('/target', {preValidation: [auth]}, Target.list)
  app.post('/target', {preValidation: [auth]}, Target.create)
  app.delete('/target/:id', {preValidation: [auth]}, Target.remove)


  app.post('/processing-template', {preValidation: [auth]}, ProcessingTemplate.create)


  app.get('/article', {preValidation: [auth]}, Article.list)
  app.post('/article', {preValidation: [auth]}, Article.create)
  app.get('/article/:id', {preValidation: [auth]}, Article.one)
  app.get('/article/:id/version/:hash', {preValidation: [auth]}, Article.getVersion)
  app.put('/article/:id', {preValidation: [auth]}, Article.update)
  app.put('/article/:id/version/:hash', {preValidation: [auth]}, Article.updateVersion)
  app.post('/article/:articleId/publish/:targetId', {preValidation: [auth]}, Article.publish)
  app.delete('/article/:id', {preValidation: [auth]}, Article.delete);
  app.get('/article-count-by-stata', {preValidation: [auth]}, Article.countByState)

  app.get('/user', {preValidation: [admin]}, User.list)
  app.post('/user/role', {preValidation: [admin]}, User.setRole)
  app.get('/me', {preValidation: [auth]}, User.getMe)
  app.patch('/me', {preValidation: [auth]}, User.pathMe)

  // gpt3
  app.post('/ask', {preValidation: [auth]}, Gpt3.ask)
  app.get('/ai-request', {preValidation: [auth]}, Gpt3.getAiRequest)

  app.post('/google-verify', Auth.googleVerify)
  app.post('/impersonate', {preValidation: [admin]}, Auth.impersonate)

  // queue
  app.post('/queue/debug', Queue.addDebug)
  app.get('/errors', {preValidation: [admin]}, ErrorController.list)
  app.delete('/errors', {preValidation: [admin]}, ErrorController.removeByStack)
  app.get('/errors-types', {preValidation: [admin]}, ErrorController.types)

  // context
  app.get('/context', {preValidation: [auth]}, Gpt3Context.list)
  app.put('/context', {preValidation: [auth]}, Gpt3Context.set)
  app.delete('/context/:id', {preValidation: [auth]}, Gpt3Context.delete)

  // context
  app.get('/prompt', {preValidation: [auth]}, Gpt3Prompt.list)
  app.put('/prompt', {preValidation: [auth]}, Gpt3Prompt.set)
  app.delete('/prompt/:id', {preValidation: [auth]}, Gpt3Prompt.delete)

  return app
}
