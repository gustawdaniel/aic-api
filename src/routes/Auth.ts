import {FastifyReply, FastifyRequest} from "fastify";
import {OAuth2Client} from 'google-auth-library';
import {prisma} from "../storage/prisma";
import {tokenizeUser} from "../functions/auth";

export class Auth {
    static async googleVerify(req: FastifyRequest<{ Body: { credential: string } }>) {
        try {
            console.log("credential", req.body.credential);
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: req.body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            console.log("payload", payload);
            if (!payload) throw new Error(`No payload`);
            console.log("payload.email", payload.email);
            if (!payload.email) throw new Error(`User without email`)

            let user = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })

            if (!user) {
                user = await prisma.users.create({
                    data: {
                        email: payload.email,
                        avatar: payload.picture ?? `https://ui-avatars.com/api/?name=${payload.name}`,
                        full_name: payload.name ?? ''
                    }
                })
            }

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar,
                    full_name: user.full_name,
                    roles: user.roles
                },
                token: tokenizeUser(user)
            };
        } catch (e) {
            console.log("errr", e);
            throw e;
        }
    }

    static async impersonate(req: FastifyRequest<{ Body: { id: string } }>, reply: FastifyReply) {
        const user = await prisma.users.findUnique({where: {id: req.body.id}})
        if(!user) return reply.notFound(`User ${req.body.id} not found`);
        return {
            user: {
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                full_name: user.full_name,
                roles: user.roles
            },
            token: tokenizeUser(user)
        }
    }
}
