import axios, { AxiosError, AxiosResponse } from 'axios';
import { logAxiosErrorToConsole } from "../hooks/errorHandler";

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

function errorDetailsFromResponseBody(error: unknown): Error {
  try {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return new Error(error.response.data.error.message);
      }
    }
    return error as Error;
  } catch (err) {
    return err as Error;
  }
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
        url: process.env.OPEN_AI_URL + '/v1/chat/completions',
        data: {
          "model": "gpt-3.5-turbo",
          messages
        },
        headers: {
          Authorization: `Bearer ${ apiKey }"`
        }
      });

      return await axios.post<Gpt3Response>(process.env.OPEN_AI_URL + '/v1/chat/completions', {
        "model": "gpt-3.5-turbo",
        messages
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ apiKey }`
        }
      });
    } catch (error: any) {
      if (!retryOn.includes(error.response?.status)) {
        console.error('axios'.red, error)
        throw errorDetailsFromResponseBody(error);
      } else if (error instanceof AxiosError) {
        logAxiosErrorToConsole(error);
      }
      if(error.response.data.seconds_to_wait) {
        const delay = error.response.data.seconds_to_wait * 1000;
        console.log(`Retrying request in ${ delay }ms...`.red);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw errorDetailsFromResponseBody(error);
      }
    }
  }
  throw new Error(`Max retry attempts reached (${ maxRetry })`);
}

