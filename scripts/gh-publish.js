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
// @ts-ignore
const admin_api_1 = __importDefault(require("@tryghost/admin-api"));
const publishGhostArticle = (title, content, publishedAt = new Date().toISOString()) => __awaiter(void 0, void 0, void 0, function* () {
    const api = new admin_api_1.default({
        url: 'https://gustawdaniel.com',
        key: '63edc54e181f1a402f59e9cf:8cd2248872b0bb8c199afa1fdd7d59f29b99c29205adb103e906dc6f176762ba\n',
        version: 'v3.0'
    });
    const postData = {
        title: title,
        html: content,
        status: "draft",
        published_at: publishedAt
    };
    try {
        const response = yield api.posts.add(postData);
        console.log("Article published successfully.");
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
});
// Example usage
const title = "My First Article";
const content = "<p>This is the content of my first article.</p>";
publishGhostArticle(title, content).catch(console.log);
