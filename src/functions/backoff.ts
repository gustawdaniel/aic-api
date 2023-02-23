import {AxiosResponse} from 'axios';
import {CreateCompletionResponse, OpenAIApi} from 'openai';
import {GptSimpleParams} from "./gpt";

export async function backoff(client: OpenAIApi, params: GptSimpleParams): Promise<AxiosResponse<CreateCompletionResponse, any>> {
    //createCompletion
    const maxRetry = 13; // 2^3 = 8192 sec -> 2.5 h
    const initialDelay = 1000;
    const retryOn = [429];

    const exponentialBackoff = (n: number) => Math.pow(2, n) * initialDelay;

    let retryCount = 0;
    let delay = initialDelay;

    while (retryCount < maxRetry) {
        try {
            return await client.createCompletion(params) as AxiosResponse<CreateCompletionResponse, any>;
        } catch (error: any) {
            if (!retryOn.includes(error.response?.status)) {
                throw error;
            }
            retryCount++;
            delay = exponentialBackoff(retryCount);
            console.log(`Retrying request in ${delay}ms...`.red);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error(`Max retry attempts reached (${maxRetry})`);
}

