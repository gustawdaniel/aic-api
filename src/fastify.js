"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFastifyServer = void 0;
const fastify_1 = __importStar(require("fastify"));
const Auth_1 = require("./routes/Auth");
const cors_1 = __importDefault(require("@fastify/cors"));
const Source_1 = require("./routes/Source");
const auth_1 = require("./functions/auth");
const sensible_1 = __importDefault(require("@fastify/sensible"));
const Request_1 = require("./routes/Request");
const Article_1 = require("./routes/Article");
const Version_1 = require("./routes/Version");
const User_1 = require("./routes/User");
const ProcessingTemplate_1 = require("./routes/ProcessingTemplate");
const Target_1 = require("./routes/Target");
const axios_1 = require("axios");
function getFastifyServer() {
    const app = (0, fastify_1.default)({});
    app.register(cors_1.default);
    app.register(sensible_1.default);
    app.setErrorHandler(function (error, request, reply) {
        var _a, _b, _c;
        if (error instanceof fastify_1.errorCodes.FST_ERR_BAD_STATUS_CODE) {
            // Log error
            this.log.error(error);
            // Send error response
            reply.status(500).send({ ok: false });
        }
        else {
            if (error instanceof axios_1.AxiosError) {
                console.log("ZZ > req".red, error.request.headers, error.request.url, error.request.method, error.request.data);
                console.log("ZZ > res".red, (_a = error.response) === null || _a === void 0 ? void 0 : _a.status, (_b = error.response) === null || _b === void 0 ? void 0 : _b.data, (_c = error.response) === null || _c === void 0 ? void 0 : _c.headers);
            }
            else {
                console.log("XX".red, error);
            }
            // fastify will use parent error handler to handle this
            reply.send(error);
        }
    });
    // there add
    // - endpoints
    // - hooks
    // - middlewares
    app.get('/', Version_1.Version.root);
    app.get('/source', { preValidation: [auth_1.auth] }, Source_1.Source.list);
    app.post('/source', { preValidation: [auth_1.auth] }, Source_1.Source.create);
    app.delete('/source/:id', { preValidation: [auth_1.auth] }, Source_1.Source.remove);
    app.get('/target', { preValidation: [auth_1.auth] }, Target_1.Target.list);
    app.post('/target', { preValidation: [auth_1.auth] }, Target_1.Target.create);
    app.delete('/target/:id', { preValidation: [auth_1.auth] }, Target_1.Target.remove);
    app.post('/processing-template', { preValidation: [auth_1.auth] }, ProcessingTemplate_1.ProcessingTemplate.create);
    app.post('/request', { preValidation: [auth_1.auth] }, Request_1.Request.inject);
    app.get('/article', { preValidation: [auth_1.auth] }, Article_1.Article.list);
    app.get('/article/:id', { preValidation: [auth_1.auth] }, Article_1.Article.one);
    app.put('/article/:id', { preValidation: [auth_1.auth] }, Article_1.Article.update);
    app.post('/article/:articleId/publish/:targetId', { preValidation: [auth_1.auth] }, Article_1.Article.publish);
    app.get('/user', { preValidation: [auth_1.admin] }, User_1.User.list);
    app.get('/me', { preValidation: [auth_1.auth] }, User_1.User.getMe);
    app.patch('/me', { preValidation: [auth_1.auth] }, User_1.User.pathMe);
    app.post('/google-verify', Auth_1.Auth.googleVerify);
    app.post('/impersonate', { preValidation: [auth_1.admin] }, Auth_1.Auth.impersonate);
    return app;
}
exports.getFastifyServer = getFastifyServer;
