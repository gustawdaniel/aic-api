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
exports.parseArticle = void 0;
const cheerio = __importStar(require("cheerio"));
const client_1 = require("@prisma/client");
function cleanText(tagName, text) {
    if (['pre', 'code'.includes(tagName)])
        return text;
    return text.replace(/\s{2,}/g, ' ');
}
function parseArticle(html, type) {
    var _a;
    switch (type) {
        case client_1.SourceType.buisnesinsider: {
            const sections = cheerio.load(html)('article>section.main').toArray();
            let title = sections.length ? cheerio.load(sections[0])('h1.article_title').text() : '';
            title || (title = (_a = cheerio.load(html)('h1.article_title').text()) !== null && _a !== void 0 ? _a : '');
            const res = sections.map((section) => {
                return cheerio.load(section)([
                    'p',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'li'
                ].map(selector => selector + ':not([class^=related])').join(', ')).toArray()
                    .map(el => ({
                    element: 'tagName' in el ? el.tagName : '',
                    children: 'children' in el ? el.children : [],
                    text: cheerio.load(el).text().trim().replace(/\s{2,}/g, ' ')
                }))
                    .filter(({ text, children }) => Boolean(text) && !children.some((c) => {
                    var _a;
                    // console.log("c", c);
                    return 'tagName' in c ? (_a = c.attribs.href) === null || _a === void 0 ? void 0 : _a.startsWith('https://www.onet.pl') : false; // exclude links to Onet
                }) && text !== 'Dalsza część artykułu znajduje się pod materiałem wideo')
                    .map((({ element, text }) => ({ element, text })));
            }).flat();
            if (/Autor: .*?, dziennikarz Business Insider Polska/.test(res[res.length - 1].text)) {
                res.pop();
            }
            if (!res.length || res[0].element !== 'h1') {
                res.unshift({
                    element: 'h1',
                    text: title
                });
            }
            return {
                title,
                components: res.map(el => ({
                    text: el.text,
                    xpath: [el.element],
                    versions: [],
                    finish_reason: ''
                }))
            };
        }
        case client_1.SourceType.ghost: {
            const title = cheerio.load(html)('title').text();
            const res = cheerio.load(html)([
                'p',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'li',
                'pre',
                'blockquote'
            ].map(selector => `main>article>section.gh-content>${selector}`).join(', ')).toArray()
                .map(el => {
                const tagName = 'tagName' in el ? el.tagName : '';
                return {
                    element: tagName,
                    text: cleanText(tagName, cheerio.load(el).text().trim())
                };
            });
            res.unshift({
                text: title,
                element: 'h1'
            });
            console.log(res);
            return {
                title,
                components: res.map(el => ({
                    text: el.text,
                    xpath: [el.element],
                    versions: [],
                    finish_reason: ''
                }))
            };
        }
    }
}
exports.parseArticle = parseArticle;
