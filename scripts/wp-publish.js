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
const axios_1 = __importDefault(require("axios"));
const publishArticle = (title, content, status = "draft") => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "https://finews.pl/wp-json/wp/v2/posts";
    const auth = {
        username: 'Shady',
        password: '7AOHiklteQ*vqa9Jqx'
    };
    const postData = {
        title: title,
        content: content,
        status: status
    };
    const config = {
        auth,
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        const response = yield axios_1.default.post(endpoint, postData, config);
        console.log("Article published successfully.");
        console.log(response.data);
    }
    catch (error) {
        console.error(error);
    }
});
// Example usage
const title = "My First Article";
const content = "<p>This is the content of my first article.</p>";
publishArticle(title, content).catch(console.error);
