import {FastifyReply, FastifyRequest} from "fastify";

import {prisma} from "../storage/prisma";
import 'colors-cli/toxic'
import { RequestType, SourceType} from "@prisma/client";
import dayjs from "dayjs";
import {getListRequest} from "../functions/getListRequest";
import {getAndParseArticle} from "../functions/getAndParseArticle";

export class Request {
    static async inject(req: FastifyRequest<{ Body: { source_id: string } }>, reply: FastifyReply) {
        const s = dayjs();
        const user = req.user;
        if(!user) return reply.unauthorized();

        const source = await prisma.sources.findFirst({
            where: {
                user_id: user.id,
                id: req.body.source_id
            }
        });
        if(!source) return reply.notFound(`Source with id ${req.body.source_id} not fount`);

        const listRequest = await getListRequest(user, source);

        const rss: ListRss = source.type === SourceType.ghost ?
            listRequest.data as unknown as ListRss<GhostRssItem> :
            listRequest.data as unknown as ListRss<BusinessInsiderRssItem>;

        const existingRequests = await prisma.requests.findMany({
            where: {
                url: {
                    in: rss.items.map(item => item.link)
                }
            }
        });

        for (const url of rss.items.map(item => item.link).filter(url => !existingRequests.map(req => req.url).includes(url))) {
            let itemRequest = await prisma.requests.create({
                data: {
                    url,
                    source_id: source.id,
                    user_id: user.id,
                    type: RequestType.article,
                }
            });
            let s = dayjs();
            const {data, html} = await getAndParseArticle(url, source.type);
            console.log(`new request in ${dayjs().diff(s)}ms`.blue);
            console.log(data)
            itemRequest = await prisma.requests.update({
                where: {
                    id: itemRequest.id
                },
                data: {
                    data: JSON.parse(JSON.stringify(data)),
                    html
                }
            });

            await prisma.articles.create({
                data: {
                    user_id: user.id,
                    request_id: itemRequest.id,
                    components: data.components,
                }
            })
        }

        console.log(`finished in ${dayjs().diff(s)}ms`.green);

        return {
            status: 'ok',
            time: dayjs().diff(s)
        }
    }
}