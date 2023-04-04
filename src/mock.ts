import fastify from "fastify";
import { sleep } from "./functions/sleep";

async function main() {
  const app = fastify();

  app.post('/openai/v1/chat/completions', async () => {
    await sleep(2000)

    return {
      "id": "chatcmpl-71QnEMDFR8JCGRz8fTJOCCFW7gKRc",
      "object": "chat.completion",
      "created": 1680575676,
      "model": "gpt-3.5-turbo-0301",
      "usage": {
        "prompt_tokens": 15,
        "completion_tokens": 89,
        "total_tokens": 104
      },
      "choices": [
        {
          "message": {
            "role": "assistant",
            "content": "The OpenAI mission is to advance artificial intelligence (AI) in a safe and beneficial way, for the betterment of society as a whole. Their goal is to develop and promote AI technologies that can enable people to live more fulfilling and productive lives, as well as to improve industries and address global challenges. They also strive to ensure that the development of AI is guided by ethical principles to ensure that it is used for the betterment of humanity."
          },
          "finish_reason": "stop",
          "index": 0
        }
      ]
    }
  });

  const address = await app.listen({port: 5000, host: '0.0.0.0'})
  console.log(`Mock listen on ${address}`);
}

main().catch(console.error)
