import * as cheerio from "cheerio";
import {ArticleData} from "../interfaces/ArticleData";
import {SourceType} from "@prisma/client";

export function parseArticle(html: string, type: SourceType): ArticleData {
    switch (type) {
        case SourceType.buisnesinsider: {
            const sections = cheerio.load(html)('article>section.main').toArray()

            let title = sections.length ? cheerio.load(sections[0])('h1.article_title').text() : '';
            title ||= cheerio.load(html)('h1.article_title').text() ?? '';

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
                    .filter(({text, children}) =>
                            Boolean(text) && !children.some((c) => {
                                // console.log("c", c);
                                return 'tagName' in c ? c.attribs.href?.startsWith('https://www.onet.pl') : false // exclude links to Onet
                            }) && text !== 'Dalsza część artykułu znajduje się pod materiałem wideo'
                    )
                    .map((({element, text}) => ({element, text})))
            }).flat()

            if (/Autor: .*?, dziennikarz Business Insider Polska/.test(res[res.length - 1].text)) {
                res.pop()
            }

            if (!res.length || res[0].element !== 'h1') {
                res.unshift({
                    element: 'h1',
                    text: title
                })
            }

            return {
                title,
                components: res.map(el => ({
                    text: el.text,
                    xpath: [el.element],
                    versions: [],
                    finish_reason: ''
                }))
            }
        }
        case SourceType.ghost: {
            const title = cheerio.load(html)('title').text()

            const res = cheerio.load(html)([
                'p',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'li',
                'pre',
                'blockquote'
            ].map(selector => `main>article>section.gh-content>${selector}`).join(', ')).toArray()
                .map(el => ({
                    element: 'tagName' in el ? el.tagName : '',
                    text: cheerio.load(el).text().trim().replace(/\s{2,}/g, ' ')
                }));

            res.unshift({
                text: title,
                element: 'h1'
            })

            console.log(res);

            return {
                title,
                components: res.map(el => ({
                    text: el.text,
                    xpath: [el.element],
                    versions: [],
                    finish_reason: ''
                }))
            }
        }
    }
}
