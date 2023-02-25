"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getArticleTitle_1 = require("../src/functions/getArticleTitle");
it('getArticleHtmlContent', () => {
    const content = (0, getArticleTitle_1.getArticleHtmlContent)({
        components: [
            {
                text: 'Hello world',
                xpath: ['h1'],
                versions: [],
                finish_reason: 'stop'
            },
            {
                text: 'I love you',
                xpath: ['p'],
                versions: [],
                finish_reason: 'stop'
            }
        ]
    });
    expect(content).toEqual(`<html><head></head><body><article><p>I love you</p></article></body></html>`);
});
it('getArticleHtmlContent with list', () => {
    const content = (0, getArticleTitle_1.getArticleHtmlContent)({
        components: [
            {
                text: 'Hello world',
                xpath: ['h1'],
                versions: [],
                finish_reason: 'stop'
            },
            {
                text: 'I love you',
                xpath: ['li'],
                versions: [],
                finish_reason: 'stop'
            }
        ]
    });
    expect(content).toEqual(`<html><head></head><body><article><ul><li>I love you</li></ul></article></body></html>`);
});
it('getArticleHtmlContent pre', () => {
    const content = (0, getArticleTitle_1.getArticleHtmlContent)({
        components: [
            {
                text: '1 + 2 = 3',
                xpath: ['pre'],
                versions: [],
                finish_reason: 'stop'
            },
        ]
    });
    expect(content).toEqual(`<html><head></head><body><article><pre><code>1 + 2 = 3</code></pre></article></body></html>`);
});
