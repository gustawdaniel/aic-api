import {FastifyRequest} from "fastify";
import {OAuth2Client} from 'google-auth-library';
import {prisma} from "../storage/prisma";
import {tokenizeUser} from "../functions/auth";


export class Auth {
    static async googleVerify(req: FastifyRequest<{ Body: { credential: string } }>) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error(`No payload`);
        if(!payload.email) throw new Error(`User without email`)

        let user = await prisma.users.findUnique({
            where: {
                email: payload.email
            }
        })

        if(!user) {
            user = await prisma.users.create({
                data: {
                    email: payload.email,
                    avatar: payload.picture ?? `https://ui-avatars.com/api/?name=${payload.name}`,
                    full_name: payload.name ?? ''
                }
            })
        }



        console.log(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                full_name: user.full_name
            },
            token: tokenizeUser(user)
        };
    }
}