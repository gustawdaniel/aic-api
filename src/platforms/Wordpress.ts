import axios, {AxiosBasicCredentials, AxiosRequestConfig, AxiosResponse} from "axios";

export class Wordpress {
    private readonly url: string;
    private readonly config: AxiosRequestConfig<{ title: string, content: string, status: string }>;

    constructor(url: string, auth: AxiosBasicCredentials) {
        this.url = url;
        this.config = {
            auth,
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    async publish(title: string, content: string): Promise<AxiosResponse<any, any>> {
        const postData = {
            title: title,
            content: content,
            status: 'publish'
        };

        const {data} = await axios.post(this.url, postData, this.config);
        return data;
    }
}
