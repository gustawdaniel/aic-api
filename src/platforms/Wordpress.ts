import axios, {AxiosBasicCredentials, AxiosRequestConfig, AxiosResponse} from "axios";
import {WpTokenResponse} from "../interfaces/WpTokenResponse";
import {parse} from "url";
import {WpArticleResponse} from "../interfaces/WpArticleResponse";
import assert from "assert";

export class Wordpress {
    private readonly host: string;
    private readonly auth: AxiosBasicCredentials;

    constructor(url: string, auth: AxiosBasicCredentials) {
        const u = parse(url);
        this.host = `${u.protocol}//${u.host}`;
        this.auth = auth;
    }

    async publish(title: string, content: string): Promise<WpArticleResponse> {
        const authEndpoint = `${this.host}/wp-json/jwt-auth/v1/token`;
        const publishEndpoint = `${this.host}/wp-json/wp/v2/posts`;

        const response = await axios.post<WpTokenResponse>(authEndpoint, this.auth);
        const token = response.data.token;

        const postData = {
            title: title,
            content: content,
            status: 'publish'
        };

        const {data} = await axios.post<WpArticleResponse>(publishEndpoint, postData, {
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
        });
        assert.strictEqual(typeof data.id, "number")
        return data;
    }
}
