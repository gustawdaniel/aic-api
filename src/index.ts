import {prisma} from "./storage/prisma";
import 'colors-cli/toxic'
import {parse as parseRss} from 'rss-to-json';
import {requests, RequestType, sources, SourceType, users} from "@prisma/client";
import dayjs from "dayjs";
import axios from "axios";
import {ArticleData} from "./interfaces/ArticleData";
import {parseArticle} from "./functions/parseArticle";

const email = 'gustaw.daniel@gmail.com';

// const s: { url: string, type: SourceType } = {
//     url: 'https://businessinsider.com.pl/gospodarka.feed',
//     type: SourceType.buisnesinsider
// }

// const s: { url: string, type: SourceType } = {
//     url: 'https://gustawdaniel.com/news/rss/',
//     type: SourceType.ghost
// }

const src: { url: string, type: SourceType } = {
    url: 'https://preciselab.io/news/rss/',
    type: SourceType.ghost
}



// async function getUser(): Promise<users> {
//     let user = await prisma.users.findFirst({
//         where: {
//             email
//         }
//     })
//     if (!user) {
//         user = await prisma.users.create({
//             data: {
//                 email,
//                 avatar: '',
//                 full_name: 'Daniel Gustaw'
//             }
//         })
//     }
//     return user;
// }

// async function getSource(user: users): Promise<sources> {
//     let source = await prisma.sources.findFirst({
//         where: {
//             url: src.url
//         }
//     })
//     if (!source) {
//         source = await prisma.sources.create({
//             data: {
//                 url: src.url,
//                 user_id: user.id,
//                 type: src.type
//             }
//         })
//     }
//     return source
// }

import { getFastifyServer } from './fastify'
import {pull} from "./storage/zero";

async function main() {
    const app = await getFastifyServer()
    await app.listen({ port: 4000, host: '0.0.0.0' })
    // start queue
    pull().catch(console.error)
    console.log(`Fastify listen on http://localhost:4000/`);
}

main().catch(console.error)
