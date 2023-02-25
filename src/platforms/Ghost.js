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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ghost = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
//@ts-ignore
const admin_api_1 = __importDefault(require("@tryghost/admin-api"));
class Ghost {
    constructor(url, adminKey, version = 'v3.0') {
        this.url = url;
        this.api = new admin_api_1.default({
            url,
            key: adminKey,
            version
        });
        const [id, secret] = adminKey.split(':');
        const token = jsonwebtoken_1.default.sign({}, Buffer.from(secret, 'hex'), {
            keyid: id,
            algorithm: 'HS256',
            expiresIn: '5m',
            audience: `/v3/admin/`
        });
        this.config = {
            headers: {
                Authorization: `Ghost ${token}`,
                'User-Agent': 'GhostAdminSDK/1.13.2',
                'Accept-Version': 'v3.0'
            }
        };
    }
    publish(title, content, publishedAt = new Date().toISOString()) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = {
                title: title,
                html: content,
                status: "draft",
                published_at: publishedAt
            };
            // await this.api.posts.add(postData);
            // {
            //     url: 'https://gustawdaniel.com/ghost/api/v3/admin/posts/',
            //         method: 'POST',
            //     data: { posts: [ [Object] ] },
            //     params: {},
            //     headers: {
            //         Authorization: 'Ghost eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYzZWRjNTRlMTgxZjFhNDAyZjU5ZTljZiJ9.eyJpYXQiOjE2NzcyMjA3MzYsImV4cCI6MTY3NzIyMTAzNiwiYXVkIjoiL3YzL2FkbWluLyJ9.4SeDuQ32mKqrQ0wcRW47puXUo1j-9VCauN9CvVOqZlA',
            //     }
            // }
            const payload = { posts: [postData] };
            console.log("GH".green, this.url + '/ghost/api/v3/admin/posts/?source=html', payload, this.config);
            const { data } = yield axios_1.default.post(this.url + '/ghost/api/v3/admin/posts/?source=html', payload, this.config);
            return data;
        });
    }
}
exports.Ghost = Ghost;
