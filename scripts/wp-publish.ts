import axios, {AxiosBasicCredentials, AxiosRequestConfig} from "axios";

const publishArticle = async (title: string, content: string, status: string = "draft") => {
    const endpoint = "https://finews.pl/wp-json/wp/v2/posts";
    const auth: AxiosBasicCredentials = {
        username: 'Shady',
        password: '7AOHiklteQ*vqa9Jqx'
    };

    const postData = {
        title: title,
        content: content,
        status: status
    };

    const config: AxiosRequestConfig<{ title: string, content: string, status: string }> | undefined = {
        auth,
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await axios.post(endpoint, postData, config);
        console.log("Article published successfully.");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// Example usage
const title = "My First Article";
const content = "<p>This is the content of my first article.</p>";
publishArticle(title, content).catch(console.error);
