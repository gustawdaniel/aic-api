"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const google_auth_library_1 = require("google-auth-library");
const prisma_1 = require("../storage/prisma");
const auth_1 = require("../functions/auth");
class Auth {
    static googleVerify(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("credential", req.body.credential);
                const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
                console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
                const ticket = yield client.verifyIdToken({
                    idToken: req.body.credential,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                console.log("payload", payload);
                if (!payload)
                    throw new Error(`No payload`);
                console.log("payload.email", payload.email);
                if (!payload.email)
                    throw new Error(`User without email`);
                let user = yield prisma_1.prisma.users.findUnique({
                    where: {
                        email: payload.email
                    }
                });
                if (!user) {
                    user = yield prisma_1.prisma.users.create({
                        data: {
                            email: payload.email,
                            avatar: (_a = payload.picture) !== null && _a !== void 0 ? _a : `https://ui-avatars.com/api/?name=${payload.name}`,
                            full_name: (_b = payload.name) !== null && _b !== void 0 ? _b : ''
                        }
                    });
                }
                return {
                    user: {
                        id: user.id,
                        email: user.email,
                        avatar: user.avatar,
                        full_name: user.full_name,
                        roles: user.roles
                    },
                    token: (0, auth_1.tokenizeUser)(user)
                };
            }
            catch (e) {
                console.log("errr", e);
                throw e;
            }
        });
    }
    static impersonate(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.prisma.users.findUnique({ where: { id: req.body.id } });
            if (!user)
                return reply.notFound(`User ${req.body.id} not found`);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar,
                    full_name: user.full_name,
                    roles: user.roles
                },
                token: (0, auth_1.tokenizeUser)(user)
            };
        });
    }
}
exports.Auth = Auth;
