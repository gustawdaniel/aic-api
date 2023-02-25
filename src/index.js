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
require("colors-cli/toxic");
const client_1 = require("@prisma/client");
const email = 'gustaw.daniel@gmail.com';
// const s: { url: string, type: SourceType } = {
//     url: 'https://businessinsider.com.pl/gospodarka.feed',
//     type: SourceType.buisnesinsider
// }
// const s: { url: string, type: SourceType } = {
//     url: 'https://gustawdaniel.com/news/rss/',
//     type: SourceType.ghost
// }
const src = {
    url: 'https://preciselab.io/news/rss/',
    type: client_1.SourceType.ghost
};
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
const fastify_1 = require("./fastify");
const zero_1 = require("./storage/zero");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield (0, fastify_1.getFastifyServer)();
        yield app.listen({ port: 4000, host: '0.0.0.0' });
        // start queue
        (0, zero_1.pull)().catch(console.error);
        console.log(`Fastify listen on http://localhost:4000/`);
    });
}
main().catch(console.error);
