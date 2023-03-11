import jwt from 'jsonwebtoken';
import axios, {AxiosRequestConfig} from "axios";

//@ts-ignore
import GhostAdminAPI from "@tryghost/admin-api";

type GhostRole = any;

interface GhostPublishResponse {
    id: '63f76881181f1a402f59e9d3',
    uuid: 'f84f4e75-6c0a-4a4b-af88-03fb92b72f60',
    title: 'My First Article',
    slug: 'my-first-article',
    mobiledoc: '{"version":"0.3.1","ghostVersion":"4.0","markups":[],"atoms":[],"cards":[],"sections":[[1,"p",[[0,[],0,""]]]]}',
    comment_id: '63f76881181f1a402f59e9d3',
    feature_image: null,
    featured: false,
    status: 'draft',
    visibility: 'public',
    email_recipient_filter: 'none',
    created_at: '2023-02-23T13:22:09.000Z',
    updated_at: '2023-02-23T13:22:09.000Z',
    published_at: '2023-02-23T13:22:08.000Z',
    custom_excerpt: null,
    codeinjection_head: null,
    codeinjection_foot: null,
    custom_template: null,
    canonical_url: null,
    tags: [],
    authors: [
        {
            id: '1',
            name: 'Daniel Gustaw',
            slug: 'daniel',
            email: 'gustaw.daniel@gmail.com',
            profile_image: 'https://gustawdaniel.com/content/images/2021/02/1608291457588.jpeg',
            cover_image: null,
            bio: null,
            website: null,
            location: 'Warszawa',
            facebook: null,
            twitter: null,
            accessibility: '{"whatsNew":{"lastSeenDate":"2020-12-08T14:38:25.000+00:00"},"nightShift":false,"launchComplete":true}',
            status: 'active',
            meta_title: null,
            meta_description: null,
            tour: '["featured-post","getting-started"]',
            last_seen: '2023-02-23T13:11:01.000Z',
            created_at: '2021-02-02T11:55:59.000Z',
            updated_at: '2023-02-23T13:11:01.000Z',
            roles: Array<GhostRole>,
            url: 'https://gustawdaniel.com/author/daniel/'
        }
    ],
    primary_author: {
        id: '1',
        name: 'Daniel Gustaw',
        slug: 'daniel',
        email: 'gustaw.daniel@gmail.com',
        profile_image: 'https://gustawdaniel.com/content/images/2021/02/1608291457588.jpeg',
        cover_image: null,
        bio: null,
        website: null,
        location: 'Warszawa',
        facebook: null,
        twitter: null,
        accessibility: '{"whatsNew":{"lastSeenDate":"2020-12-08T14:38:25.000+00:00"},"nightShift":false,"launchComplete":true}',
        status: 'active',
        meta_title: null,
        meta_description: null,
        tour: '["featured-post","getting-started"]',
        last_seen: '2023-02-23T13:11:01.000Z',
        created_at: '2021-02-02T11:55:59.000Z',
        updated_at: '2023-02-23T13:11:01.000Z',
        roles: Array<GhostRole>,
        url: 'https://gustawdaniel.com/author/daniel/'
    },
    primary_tag: null,
    url: 'https://gustawdaniel.com/p/f84f4e75-6c0a-4a4b-af88-03fb92b72f60/',
    excerpt: null,
    send_email_when_published: false,
    email: null,
    og_image: null,
    og_title: null,
    og_description: null,
    twitter_image: null,
    twitter_title: null,
    twitter_description: null,
    meta_title: null,
    meta_description: null,
    email_subject: null,
    frontmatter: null
}

export class Ghost {
    private readonly url: string;
    private readonly config: AxiosRequestConfig;
    private readonly api: GhostAdminAPI;

    constructor(url: string, adminKey: string, version: string = 'v5.37') {
        this.url = url;
        this.api = new GhostAdminAPI({
            url,
            key: adminKey,
            version
        });

        this.config = {
            headers: {
                Authorization: `Ghost ${Ghost.adminApiKeyToToken(adminKey)}`,
                'User-Agent': 'GhostAdminSDK/1.13.2',
                // 'Accept-Version': 'v3.0',
                'Content-Type': 'application/json'
            }
        }
    }

    static adminApiKeyToToken(key: string): string {
        // Split the key into ID and SECRET
        const [id, secret] = key.split(':');

        // Create the token (including decoding secret)
        return jwt.sign({}, Buffer.from(secret, 'hex'), {
            keyid: id,
            algorithm: 'HS256',
            expiresIn: '5m',
            audience: `/admin/`
        });
    }

    async publish(title: string, content: string, publishedAt: string = new Date().toISOString()): Promise<GhostPublishResponse> {
        const postData = {
            title: title,
            html: content,
            status: "draft",
            published_at: publishedAt
        };

        const payload = {posts: [postData]};
        console.log("GH".green, this.url + '/ghost/api/admin/posts/?source=html', payload, this.config)
        const {data} = await axios.post(
            this.url + '/ghost/api/admin/posts/?source=html', payload, this.config
        );

        console.dir(data, {depth: 15});

        return data;
    }
}
