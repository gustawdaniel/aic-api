import {users} from "@prisma/client";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken'
import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";

const issuer = `aic`;
const jwtKey = process.env.JWT_SECRET_KEY ?? 'test';

export interface JWTUser {
    id: string
    email: string
}

export interface JWTPayload {
    sub: string,
    email: string,
    iss: string,
    exp: number
}

export function tokenizeUser(user: Pick<users, 'id' | 'email'>): string {
    return jwt.sign({
        sub: user.id,
        email: user.email,
        iss: issuer,
        exp: dayjs().add(1, 'month').unix()
    }, jwtKey)
}

export function getUser(token?: string): JWTUser | null {
    if (!token) {
        return null
    } else {
        token = token.replace(/^Bearer\s+/, '')

        const jwtPayload = jwt.verify(token, jwtKey) as unknown as JWTPayload

        return {
            id: jwtPayload.sub,
            email: jwtPayload.email,
        }
    }
}

export async function auth<T extends RouteGenericInterface>(request: FastifyRequest<T>, reply: FastifyReply) {
    const token = (request.headers.authorization || '').replace(/Bearer\s+/, '') || undefined
    request.user = getUser(token)
    if (!request.user) reply.unauthorized()
}
