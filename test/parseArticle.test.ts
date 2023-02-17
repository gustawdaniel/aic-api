import fs from 'fs';
import {parseArticle} from "../src/functions/parseArticle";
import {SourceType} from "@prisma/client";
import {describe} from "node:test";

describe('parseArticle', () => {
    it('business insider', () => {
        const html = fs.readFileSync(__dirname + '/bi.article.html').toString()
        expect(typeof html).toEqual('string');
        const article = parseArticle(html, SourceType.buisnesinsider);
        expect(article.title).toEqual('Czy to koniec restauracji? "Może być jak za PRL"')

        const res = article.components;

        expect(res[0].text).toEqual(article.title);
        expect(res[0].xpath[0]).toEqual('h1');

        expect(res[1].text).toContain('Branży')
        expect(res[1].xpath[0]).toEqual('p')

        expect(res[2].text).toContain('Balansowanie')
        expect(res[2].xpath[0]).toEqual('li')

        expect(res[res.length - 1].text).toContain('stawek czynszów.')

        const allText = res.map(el => el.text).join(' ');

        expect(allText).not.toContain('Więcej takich informacji')
        expect(allText).not.toContain('Czytaj także w BUSINESS INSIDER')
        expect(allText).not.toContain('Dalsza część artykułu')
    });

    it('ghost', () => {
        const html = fs.readFileSync(__dirname + '/gh.article.html').toString()
        expect(typeof html).toEqual('string');
        const article = parseArticle(html, SourceType.ghost);
        expect(article.title).toEqual('Git styled calendar with custom dates')

        const res = article.components;

        expect(res[0].text).toEqual(article.title);
        expect(res[0].xpath[0]).toEqual('h1');

        expect(res[1].text).toContain('Let us assume that you have a set of dates. You want to display these dates in a readable clear way.')
        expect(res[1].xpath[0]).toEqual('p')

        expect(res[2].text).toContain('For example like this:')
        expect(res[2].xpath[0]).toEqual('p')

        expect(res[res.length - 1].text).toContain('Screenshot from my console')

    })
})