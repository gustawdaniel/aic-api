"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleHtmlContent = exports.getArticleTitle = void 0;
const cheerio = __importStar(require("cheerio"));
function getArticleTitle(article) {
    const header = article.components.find((el) => el.xpath.includes('h1'));
    if (header)
        return header.text;
    const header2 = article.components.find((el) => el.xpath.includes('h2'));
    if (header2)
        return header2.text;
    const any = article.components.find(() => true);
    if (any)
        return any.text;
    return 'Empty article... Probably there is bug in scraping. Please write to support.';
}
exports.getArticleTitle = getArticleTitle;
function skipTitle(components) {
    return components.filter((c, i) => i !== 0 || !c.xpath.includes('h1'));
}
function getArticleHtmlContent({ components }) {
    let $ = cheerio.load(`<html><body><article></article></body></html>`);
    let listContent = '';
    for (let { text, xpath } of skipTitle(components)) {
        const tag = xpath[0];
        if (tag === 'li') {
            listContent += `<${tag}>${text}</${tag}>`;
        }
        else if (tag !== 'li' && listContent.length) {
            $('article').append(`<ul>${listContent}</ul>`);
            listContent = '';
        }
        else if (tag === 'pre') {
            $('article').append(`<${tag}><code>${text}</code></${tag}>`);
        }
        else {
            $('article').append(`<${tag}>${text}</${tag}>`);
        }
    }
    if (listContent) {
        $('article').append(`<ul>${listContent}</ul>`);
    }
    return $.html();
}
exports.getArticleHtmlContent = getArticleHtmlContent;
