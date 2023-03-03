import axios, {AxiosResponse} from 'axios';

export type Gpt3Role = 'assistant' | 'user' | 'system'

export interface Gpt3Message {
    "role": Gpt3Role,
    "content": string
}

export interface Gpt3Response {
    'id': string,
    'object': string,
    'created': number,
    'model': 'gpt-3.5-turbo',
    'usage': { 'prompt_tokens': number, 'completion_tokens': number, 'total_tokens': number },
    'choices': Array<
        {
            'message': {
                'role': Gpt3Role,
                'content': string
            },
            'finish_reason': string //'stop',
            'index': number
        }>

}

export async function backoff(apiKey: string, messages: Gpt3Message[]): Promise<AxiosResponse<Gpt3Response, any>> {
    //createCompletion
    const maxRetry = 13; // 2^3 = 8192 sec -> 2.5 h
    const initialDelay = 1000;
    const retryOn = [429];

    const exponentialBackoff = (n: number) => Math.pow(2, n) * initialDelay;

    let retryCount = 0;
    let delay = initialDelay;

    while (retryCount < maxRetry) {
        try {
            console.log("req", {
                url: 'https://api.openai.com/v1/chat/completions',
                data: {
                    "model": "gpt-3.5-turbo",
                    messages
                },
                headers: {
                    Authorization: `Bearer ${apiKey}"`
                }
            });

            return await axios.post<Gpt3Response>('https://api.openai.com/v1/chat/completions', {
                "model": "gpt-3.5-turbo",
                messages
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            });
        } catch (error: any) {
            if (!retryOn.includes(error.response?.status)) {
                console.error('axios'.red, error)
                console.error('res.data'.red, error.response.data)
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

