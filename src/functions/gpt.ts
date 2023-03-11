import {prisma} from "../storage/prisma";
import dayjs from "dayjs";
import {backoff, Gpt3Message} from "./backoff";
import {wordsCount} from "./wordsCount";

// // Set your API key as an environment variable
// const API_KEY = process.env.OPENAI_API_KEY;

export interface GptSimpleResponse {
    message: {
        content: string,
        'role': 'assistant' | 'user' | 'system',
    },
    finish_reason: string
}

export interface GptSimpleParams {
    prompt: string,
    model: string,
}

export class GPT3 {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async ask(messages: Gpt3Message[]): Promise<GptSimpleResponse> {
        const model = "gpt-3.5-turbo";

        console.log(1);
        const existingAnswer = await prisma.ai_requests.findFirst({
            where: {
                model,
                messages
            }
        });

        console.log(2);
        if (existingAnswer && existingAnswer.choices.length) {
            return {
                message: existingAnswer.choices[0].message,
                finish_reason: existingAnswer.choices[0].finish_reason ?? ''
            }
        }

        console.log(3);
        const request = await prisma.ai_requests.create({
            data: {
                model,
                messages
            }
        })

        try {
            console.log("query".yellow, messages);
            const {data} = await backoff(this.apiKey, messages);
            console.log("response".green, data);

            if (!data.choices.length) {
                throw new Error(`No choices in GPT answer`);
            }

            await prisma.ai_requests.update({
                where: {id: request.id},
                data: {
                    choices: data.choices.map((c) => ({
                        message: c.message,
                        index: c.index ?? 0,
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

            return {message: data.choices[0].message, finish_reason: data.choices[0].finish_reason ?? ''}
        } catch (error: any) {
            console.log(error);
            await prisma.error_logs.create({
                data: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    context: {
                        messages: JSON.parse(JSON.stringify(messages))
                    }
                }
            });
            return {message: {content: error.message, role: 'system'}, finish_reason: 'model_failure'};
        }
    }
}


