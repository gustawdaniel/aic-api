import {sleep} from "../functions/sleep";
import {prisma} from "./prisma";
import {GPT3} from "../functions/gpt";
import {Component, processing_templates} from "@prisma/client";
import {AsyncQueue} from '@gustawdaniel/async-queue'
import {dispatchQueueProgress, ee} from "./event";
import {uid} from "uid";
import {Gpt3Message} from "../functions/backoff";

function getCommand(
    processing_template: processing_templates,
    component: Component
): string {
    if (Boolean(processing_template.paragraph_prompt) && component.xpath.some(tag => ["p", "blockquote", "li"].includes(tag))) {
        return processing_template.paragraph_prompt
    } else if (Boolean(processing_template.code_prompt) && component.xpath.some(tag => ["pre", "code"].includes(tag))) {
        return processing_template.code_prompt
    } else if (Boolean(processing_template.header_prompt) && component.xpath.some(tag => ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag))) {
        return processing_template.header_prompt
    }
    return '';
}


export interface DebugQueueItem {
    id: string,
    type: string,
    progress: number
    wait: number
}

const debugQueue = new AsyncQueue<DebugQueueItem>(async item => {
    console.log("queued".yellow, item);
    const steps = 50;

    for (let i = 0; i < steps; i++) {
        await sleep(item.wait / steps);
        dispatchQueueProgress({
            id: item.id,
            type: 'debug',
            progress: (i + 1) / (steps + 1),
            resource_id: item.id
        });
    }

    console.log("solved".yellow, item);
    dispatchQueueProgress({
        id: item.id,
        type: 'debug',
        progress: 1,
        resource_id: item.id
    });
    console.log("ee", ee);
});

export interface ProcessArticleQueueItem {
    user_id: string,
    queue_id: string,
    progress: number
    gpt3_api_key: string
    article_id: string
}

export const processArticleQueue = new AsyncQueue<ProcessArticleQueueItem>(async item => {
    console.log(1, item);
    await sleep(500);

    console.time("queue");
    const id = item.article_id;
    const gpt3_api_key = item.gpt3_api_key;

    if (!gpt3_api_key) {
        await prisma.articles.update({
            where: {id},
            data: {
                state: 'new'
            }
        });
        return;
    }

    const article = await prisma.articles.findUnique({
        where: {id}, include: {
            processing_template: true
        }
    });

    if (!article || !article.processing_template) {
        return;
    }

    const client = new GPT3(gpt3_api_key);

    let counter = 0;
    for (const component of article.components) {
        const command = getCommand(article.processing_template, component);
        if (command.length) {

            const userMessage = `${command}\n\n${component.text}`;
            const question: Gpt3Message[] = [
                {role: 'system', content: article.processing_template.context},
                {role: 'user', content: userMessage}
            ];

            const {
                message,
                finish_reason
            } = await client.ask(question);
            console.log(userMessage.blue)
            console.log("[" + String(`${finish_reason}`.yellow) + "]" + String(`\t${message.content}`.green))
            // TODO: fix
            // component.versions.push({text: component.text, replaced_at: dayjs().toDate()});
            component.text = message.content;
            component.finish_reason = finish_reason;
        } else {
            // no process this paragraph
        }

        counter++;

        dispatchQueueProgress({
            id: item.queue_id,
            type: 'process-article',
            progress: counter / article.components.length,
            resource_id: item.article_id
        });
    }

    await prisma.articles.update({
        where: {id},
        data: {
            components: article.components,
            state: 'verification'
        }
    });


    dispatchQueueProgress({
        id: item.queue_id,
        type: 'process-article',
        progress: 1,
        resource_id: item.article_id
    });

    console.timeEnd("queue");
})

processArticleQueue.start();

debugQueue.start();

export {debugQueue}

export async function setupArticleQueue() {
    const articles = await prisma.articles.findMany({
        where: {
            state: 'queued',
            user: {
                gpt3_api_key: {
                    isSet: true,
                    not: ''
                }
            }
        },
        include: {
            user: true
        }
    });

    for (const article of articles) {
        await processArticleQueue.push({
            user_id: article.user_id,
            article_id: article.id,
            gpt3_api_key: article.user.gpt3_api_key ?? '',
            queue_id: uid(),
            progress: 0
        });
    }
}
