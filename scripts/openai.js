"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const openai_1 = require("openai");
// Set your API key as an environment variable
const API_KEY = process.env.OPENAI_API_KEY;
const configuration = new openai_1.Configuration({
    apiKey: API_KEY,
});
// Set the prompt for GPT-3 to complete
// const prompt = "Hello, GPT-3!";
// const prompt = `Translate it to english:
//
// Prawo Zipfa mówi, że jeśli posortuje się słowa w danym języku względem częstości ich występowania, to to częstość będzie odwrotnie proporcjonalna do pozycji (rangi) słowa.`
const prompt = `Jednie przetłumacz poniższy tekst na angielski bez omawiania czym to jest

Zasada Same Origin`;
// Initialize the OpenAI API client with your API key
const client = new openai_1.OpenAIApi(configuration);
// Make the completion request
client.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.1,
    max_tokens: 6,
    top_p: 0,
    frequency_penalty: 0.5,
    presence_penalty: 1,
}).then(res => {
    console.log(res.data);
    console.log(res.data.choices);
    console.log(res.data.choices[0].text);
}).catch(console.error);
