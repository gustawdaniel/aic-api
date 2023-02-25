"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPT3 = void 0;
const openai_1 = require("openai");
const prisma_1 = require("../storage/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
const backoff_1 = require("./backoff");
const wordsCount_1 = require("./wordsCount");
class GPT3 {
    constructor(apiKey) {
        const configuration = new openai_1.Configuration({
            apiKey,
        });
        this.client = new openai_1.OpenAIApi(configuration);
    }
    static params(prompt) {
        // const prompt = [command, text].join('\n\n');
        const [command, text] = prompt.split(`\n\n`);
        const max_tokens = /(przetłumacz)|(translate)/.test(command) ? (0, wordsCount_1.wordsCount)(text) * 2 : 3700;
        return {
            prompt,
            max_tokens,
            temperature: 1,
            model: "text-davinci-003",
            top_p: 0,
            frequency_penalty: 0.5,
            presence_penalty: 1,
        };
    }
    ask(prompt) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const existingAnswer = yield prisma_1.prisma.ai_requests.findFirst({
                where: GPT3.params(prompt)
            });
            if (existingAnswer && existingAnswer.choices.length) {
                return {
                    text: (_a = existingAnswer.choices[0].text) !== null && _a !== void 0 ? _a : '',
                    finish_reason: (_b = existingAnswer.choices[0].finish_reason) !== null && _b !== void 0 ? _b : ''
                };
            }
            const request = yield prisma_1.prisma.ai_requests.create({
                data: GPT3.params(prompt)
            });
            try {
                const { data } = yield (0, backoff_1.backoff)(this.client, GPT3.params(prompt));
                if (!data.choices.length) {
                    throw new Error(`No choices in GPT answer`);
                }
                yield prisma_1.prisma.ai_requests.update({
                    where: { id: request.id },
                    data: {
                        choices: data.choices.map((c) => {
                            var _a, _b, _c;
                            return ({
                                text: (_a = c.text) !== null && _a !== void 0 ? _a : '',
                                index: (_b = c.index) !== null && _b !== void 0 ? _b : 0,
                                logprobs: String(c.logprobs),
                                finish_reason: (_c = c.finish_reason) !== null && _c !== void 0 ? _c : ''
                            });
                        }),
                        gpt_id: data.id,
                        created: (0, dayjs_1.default)().toDate(),
                        object: data.object,
                        usage: {
                            prompt_tokens: (_d = (_c = data.usage) === null || _c === void 0 ? void 0 : _c.prompt_tokens) !== null && _d !== void 0 ? _d : 0,
                            total_tokens: (_f = (_e = data.usage) === null || _e === void 0 ? void 0 : _e.total_tokens) !== null && _f !== void 0 ? _f : 0,
                            completion_tokens: (_h = (_g = data.usage) === null || _g === void 0 ? void 0 : _g.completion_tokens) !== null && _h !== void 0 ? _h : 0,
                        },
                    }
                });
                return { text: (_j = data.choices[0].text) !== null && _j !== void 0 ? _j : '', finish_reason: (_k = data.choices[0].finish_reason) !== null && _k !== void 0 ? _k : '' };
            }
            catch (error) {
                yield prisma_1.prisma.error_logs.create({
                    data: {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        context: {
                            prompt
                        }
                    }
                });
                return { text: '', finish_reason: 'model_failure' };
            }
        });
    }
}
exports.GPT3 = GPT3;
