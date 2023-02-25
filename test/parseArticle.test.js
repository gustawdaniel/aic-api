"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const parseArticle_1 = require("../src/functions/parseArticle");
const client_1 = require("@prisma/client");
const node_test_1 = require("node:test");
(0, node_test_1.describe)('parseArticle', () => {
    it('business insider', () => {
        const html = fs_1.default.readFileSync(__dirname + '/bi.article.html').toString();
        expect(typeof html).toEqual('string');
        const article = (0, parseArticle_1.parseArticle)(html, client_1.SourceType.buisnesinsider);
        expect(article.title).toEqual('Czy to koniec restauracji? "Może być jak za PRL"');
        const res = article.components;
        expect(res[0].text).toEqual(article.title);
        expect(res[0].xpath[0]).toEqual('h1');
        expect(res[1].text).toContain('Branży');
        expect(res[1].xpath[0]).toEqual('p');
        expect(res[2].text).toContain('Balansowanie');
        expect(res[2].xpath[0]).toEqual('li');
        expect(res[res.length - 1].text).toContain('stawek czynszów.');
        const allText = res.map(el => el.text).join(' ');
        expect(allText).not.toContain('Więcej takich informacji');
        expect(allText).not.toContain('Czytaj także w BUSINESS INSIDER');
        expect(allText).not.toContain('Dalsza część artykułu');
    });
    it('main title in business insider', () => {
        // https://businessinsider.com.pl/prawo/prawnik-bankow-opinia-rzecznika-tsue-w-sprawie-c-52021-jest-sprzeczna/j2k38xl
        const html = fs_1.default.readFileSync(__dirname + '/bi2.article.html').toString();
        expect(typeof html).toEqual('string');
        const article = (0, parseArticle_1.parseArticle)(html, client_1.SourceType.buisnesinsider);
        expect(article.title).toEqual('Opinia rzecznika TSUE jest wewnętrznie sprzeczna. Prawnik banków: poczekajmy na wyrok');
    });
    it('ghost', () => {
        const html = fs_1.default.readFileSync(__dirname + '/gh.article.html').toString();
        expect(typeof html).toEqual('string');
        const article = (0, parseArticle_1.parseArticle)(html, client_1.SourceType.ghost);
        expect(article.title).toEqual('Git styled calendar with custom dates');
        const res = article.components;
        expect(res[0].text).toEqual(article.title);
        expect(res[0].xpath[0]).toEqual('h1');
        expect(res[1].text).toContain('Let us assume that you have a set of dates. You want to display these dates in a readable clear way.');
        expect(res[1].xpath[0]).toEqual('p');
        expect(res[2].text).toContain('For example like this:');
        expect(res[2].xpath[0]).toEqual('p');
        const preWithDates = res.find(cmp => cmp.text.startsWith('2019-08-13'));
        expect(preWithDates).toBeDefined();
        console.log(preWithDates);
        const preWithRust = res.find(cmp => cmp.xpath.includes('pre') && cmp.text.includes('use std::io;'));
        expect(preWithRust).toBeDefined();
        console.log(preWithRust);
        expect(preWithRust === null || preWithRust === void 0 ? void 0 : preWithRust.text).toStrictEqual(`use linear_sort_reverse_search_rust_easy::reverse_search;
use std::io;

fn main() -> io::Result<()> {
    reverse_search(&mut io::stdin(), &mut io::stdout())
}`);
        expect(res[res.length - 1].text).toContain('Screenshot from my console');
    });
});
