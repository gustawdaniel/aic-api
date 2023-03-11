import axios, {AxiosBasicCredentials, AxiosError, AxiosRequestConfig} from "axios";
import assert from "assert";
import {WpTokenResponse} from "../src/interfaces/WpTokenResponse";
import {WpArticleResponse} from "../src/interfaces/WpArticleResponse";

const host = `https://finews.pl`;



const publishArticle = async (title: string, content: string, status: string = "draft") => {

    const authEndpoint = `${host}/wp-json/jwt-auth/v1/token`;

    const endpoint = `${host}/wp-json/wp/v2/posts`;
    const auth: AxiosBasicCredentials = {
        username: 'Shady',
        password: '7AOHiklteQ*vqa9Jqx'
    };

    let token = '';

    try {
        const response = await axios.post<WpTokenResponse>(authEndpoint, auth);
        token = response.data.token;
    } catch (e) {
        console.log(e);
        process.exit()
    }


    const postData = {
        title: title,
        content: content,
        status: status
    };

    const config: AxiosRequestConfig<{ title: string, content: string, status: string }> | undefined = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post<WpArticleResponse>(endpoint, postData, config);
        console.log("Article published successfully.");
        console.dir(response.data, {depth: 20});
        assert.strictEqual(typeof response.data.id, "number")
    } catch (error) {
        console.error(error);
        console.error((error as AxiosError).response?.data);
        process.exit();
    }
}

// Example usage
const title = "My First Article";
const content = "<p>This is the content of my first article.</p>";
publishArticle(title, content).catch(console.error);
