import {requests, RequestType, sources, users} from "@prisma/client";
import {prisma} from "../storage/prisma";
import dayjs from "dayjs";
import {parse as parseRss} from "rss-to-json";
import {JWTUser} from "./auth";

export async function getListRequest(user: JWTUser, source: sources): Promise<requests> {
    let request = await prisma.requests.findFirst({
        where: {
            user_id: user.id,
            type: RequestType.list,
            source_id: source.id,
            created_at: {
                gte: dayjs().subtract(6, 'h').toDate()
            }
        }
    })
    if (!request) {

        request = await prisma.requests.create({
            data: {
                user_id: user.id,
                type: RequestType.list,
                source_id: source.id,
                url: source.url
            }
        })
        let s = dayjs();
        const rss = await parseRss(source.url);
        console.log(`new request in ${dayjs().diff(s)}ms`.blue);
        request = await prisma.requests.update({
            where: {
                id: request.id
            },
            data: {
                data: rss,
                response_at: dayjs().toDate()

            }
        })
    }

    return request;
}
