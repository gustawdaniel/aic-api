import {Configuration, OpenAIApi} from "openai";
import {prisma} from "../storage/prisma";
import dayjs from "dayjs";
import {backoff} from "./backoff";
import {wordsCount} from "./wordsCount";

// // Set your API key as an environment variable
// const API_KEY = process.env.OPENAI_API_KEY;

export interface GptSimpleResponse {
    text: string,
    finish_reason: string
}

export interface GptSimpleParams {
    prompt: string,
    max_tokens: number,
    temperature: number,
    model: string,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number
}

export class GPT3 {
    private readonly client: OpenAIApi;

    constructor(apiKey: string) {
        const configuration = new Configuration({
            apiKey,
        });

        this.client = new OpenAIApi(configuration);
    }

    static params(prompt: string): GptSimpleParams {
        // const prompt = [command, text].join('\n\n');
        const [command, text] = prompt.split(`\n\n`);

        const max_tokens = /(przetłumacz)|(translate)/.test(command) ? wordsCount(text) * 2 : 3700;

        return {
            prompt,
            max_tokens,
            temperature: 1,
            model: "text-davinci-003",
            top_p: 0,
            frequency_penalty: 0.5,
            presence_penalty: 1,
        }
    }

    async ask(prompt: string): Promise<GptSimpleResponse> {

        const existingAnswer = await prisma.ai_requests.findFirst({
            where: GPT3.params(prompt)
        });

        if (existingAnswer && existingAnswer.choices.length) {
            return {
                text: existingAnswer.choices[0].text ?? '',
                finish_reason: existingAnswer.choices[0].finish_reason ?? ''
            }
        }

        const request = await prisma.ai_requests.create({
            data: GPT3.params(prompt)
        })

        try {
            const {data} = await backoff(this.client, GPT3.params(prompt));

            if (!data.choices.length) {
                throw new Error(`No choices in GPT answer`);
            }

            await prisma.ai_requests.update({
                where: {id: request.id},
                data: {
                    choices: data.choices.map((c) => ({
                        text: c.text ?? '',
                        index: c.index ?? 0,
                        logprobs: String(c.logprobs),
                        finish_reason: c.finish_reason ?? ''
                    })),
                    gpt_id: data.id,
                    created: dayjs().toDate(),
                    object: data.object,
                    usage: {
                        prompt_tokens: data.usage?.prompt_tokens ?? 0,
                        total_tokens: data.usage?.total_tokens ?? 0,
                        completion_tokens: data.usage?.completion_tokens ?? 0,
                    },
                }
            })

            return {text: data.choices[0].text ?? '', finish_reason: data.choices[0].finish_reason ?? ''}
        } catch (error: any) {
            await prisma.error_logs.create({
                data: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    context: {
                        prompt
                    }
                }
            });
            return {text: '', finish_reason: 'model_failure'};
        }
    }
}


