// @ts-ignore
import GhostAdminAPI from "@tryghost/admin-api";

const publishGhostArticle = async (title: string, content: string, publishedAt: string = new Date().toISOString()) => {
    const api = new GhostAdminAPI({
        url: 'https://gustawdaniel.com',
        key: '63edc54e181f1a402f59e9cf:8cd2248872b0bb8c199afa1fdd7d59f29b99c29205adb103e906dc6f176762ba\n',
        version: 'v3.0'
    });


    const postData = {
        title: title,
        html: content,
        status: "draft",
        published_at: publishedAt
    };

    try {
        const response = await api.posts.add(postData);
        console.log("Article published successfully.");
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

// Example usage
const title = "My First Article";
const content = "<p>This is the content of my first article.</p>";
publishGhostArticle(title, content).catch(console.log);
