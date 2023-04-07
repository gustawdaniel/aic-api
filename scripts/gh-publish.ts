import 'dotenv/config';
import 'colors-cli/toxic'
import { getArticleHtmlContent } from "../src/functions/getArticleHtmlContent";
import { Ghost } from "../src/platforms/Ghost";

const publishGhostArticle = async (title: string, content: string, publishedAt: string = new Date().toISOString()) => {
    const target = {
        url: 'https://gustawdaniel.com',
        auth:{
            key: process.env.GHOST_API_KEY,
        }
    };

    try {
        const response = await new Ghost(target.url, target.auth.key ?? '').publish(title, content)
        console.log("Article published successfully.");
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

// Example usage
const title = "My First Article";
const content = getArticleHtmlContent({
    components: [
        {
            id: '1',
            text: 'Hello world',
            xpath: ['p'],
            finish_reason: 'stop',
            ai_requests: [],
        },
        {
            id: '2',
            text: 'https://preciselab.io/content/images/2023/03/1_SwgB2rxPWgOjbh030ETxyg.png',
            xpath: ['figure','img'],
            finish_reason: 'stop',
            ai_requests: [],
        },
        {
            id: '1',
            text: 'test',
            xpath: ['p'],
            finish_reason: 'stop',
            ai_requests: [],
        },
        {
            id: '2',
            text: 'https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io',
            xpath: ['figure','a'],
            finish_reason: 'stop',
            ai_requests: [],
        },
    ]
});
// const content = `<html><head></head><body><article><p>Ok</p><figure><img src="https://preciselab.io/content/images/2023/03/1_SwgB2rxPWgOjbh030ETxyg.png"></figure><p>second</p><figure><a href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"></figure><p>end</p>
// <figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Install MongoDB Community Edition on Red Hat or CentOS — MongoDB Manual</div><div class="kg-bookmark-description"></div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://www.mongodb.com/docs/assets/favicon.ico"></div></div><div class="kg-bookmark-thumbnail"><img src="https://www.mongodb.com/docs/assets/meta_generic.png"></div></a></figure>
// <p>xx</p>
// <figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Install MongoDB Community Edition on Red Hat or CentOS — MongoDB Manual</div><div class="kg-bookmark-description"></div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://www.mongodb.com/docs/assets/favicon.ico"></div></div><div class="kg-bookmark-thumbnail"></div></a></figure>
// <p>without div</p>
// <figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Install MongoDB Community Edition on Red Hat or CentOS — MongoDB Manual</div><div class="kg-bookmark-description"></div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://www.mongodb.com/docs/assets/favicon.ico"></div></div></a></figure>
// <p>no favicon</p>
// <figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Install MongoDB Community Edition on Red Hat or CentOS — MongoDB Manual</div><div class="kg-bookmark-description"></div><div class="kg-bookmark-metadata"></div></div></a></figure>
// <p>no favicon2</p>
// <figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Install MongoDB Community Edition on Red Hat or CentOS — MongoDB Manual</div><div class="kg-bookmark-description"></div></div></a></figure>
// <p>with text</p>
// <p><a href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io">https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io</a></p>
// <p>final</p>
// <a href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io"/>
// </article></body></html>`;
publishGhostArticle(title, content).catch(console.log);
