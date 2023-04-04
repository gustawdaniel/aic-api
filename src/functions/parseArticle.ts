import * as cheerio from "cheerio";
import { ArticleData } from "../interfaces/ArticleData";
import { Component, SourceType } from "@prisma/client";
import { uid } from "uid";

function cleanText(tagName: string, text: string): string {
  if (['pre', 'code'.includes(tagName)]) return text;
  return text.replace(/\s{2,}/g, ' ')
}

interface Section {
  element: string, text: string
}

function buildArticleData(title: string, sections: Section[]): ArticleData {
  return {
    title,
    components: sections.map((el): Component => ({
      id: uid(),
      text: el.text,
      xpath: [el.element],
      finish_reason: '',
      ai_requests: [],
    }))
  }
}

export function parseArticle(html: string, type: SourceType): ArticleData {
  switch (type) {
    case SourceType.buisnesinsider: {
      const sectionsAsElements = cheerio.load(html)('article>section.main').toArray()

      let title = sectionsAsElements.length ? cheerio.load(sectionsAsElements[0])('h1.article_title').text() : '';
      title ||= cheerio.load(html)('h1.article_title').text() ?? '';

      const sections: Section[] = sectionsAsElements.map((section) => {
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
          .filter(({text, children}) => {
              return Boolean(text)
                && !(
                  (text.startsWith('Zobacz także') || text.startsWith('Zobacz też') || text.startsWith('Więcej takich informacji') || text.startsWith('Czytaj także w BUSINESS INSIDER'))
                  && children.some((c) => {
                    return 'tagName' in c ? ['https://www.onet.pl', 'https://businessinsider.com.pl'].some(url => c.attribs.href?.startsWith(url)) : false
                  }))
                && !['Dalsza część artykułu znajduje się pod materiałem wideo', 'Dalsza część artykułu znajduje się poniżej materiału wideo'].includes(text)
            }
          )
          .map((({element, text}) => ({element, text})))
      }).flat()

      if (/Autor: .*?, dziennikarz Business Insider Polska/.test(sections[sections.length - 1].text)) {
        sections.pop()
      }

      if (!sections.length || sections[0].element !== 'h1') {
        sections.unshift({
          element: 'h1',
          text: title
        })
      }

      return buildArticleData(title, sections)
    }
    case SourceType.ghost: {
      const title = cheerio.load(html)('title').text()

      const sections:Section[] = cheerio.load(html)([
        'p',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'li',
        'pre',
        'blockquote'
      ].map(selector => `main>article>section.gh-content>${ selector }`).join(', ')).toArray()
        .map(el => {
          const tagName = 'tagName' in el ? el.tagName : '';
          return {
            element: tagName,
            text: cleanText(tagName, cheerio.load(el).text().trim())
          }
        });

      sections.unshift({
        text: title,
        element: 'h1'
      })

      return buildArticleData(title, sections)
    }
  }
}
