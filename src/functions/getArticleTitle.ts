import { articles, Component } from "@prisma/client";
import * as cheerio from 'cheerio';


export function getArticleTitle(article: Pick<articles, 'components'>): string {
  const header = article.components.find((el) => el.xpath.includes('h1'));
  if (header) return header.text;
  const header2 = article.components.find((el) => el.xpath.includes('h2'));
  if (header2) return header2.text;
  const any = article.components.find(() => true);
  if (any) return any.text;
  return 'Empty article... Probably there is bug in scraping. Please write to support.'
}

function skipTitle(components: Component[]): Component[] {
  return components.filter((c, i) => i !== 0 || !c.xpath.includes('h1'));
}

export function getArticleHtmlContent({components}: { components: Component[] }): string {
  let $ = cheerio.load(`<html><body><article></article></body></html>`);
  let listContent = '';

  for (let {text, xpath} of skipTitle(components)) {
    const tag: string = xpath[0];
    if (tag === 'li') {
      listContent += `<${ tag }>${ text }</${ tag }>`;
    } else if (tag !== 'li' && listContent.length) {
      $('article').append(`<ul>${ listContent }</ul>`);
      listContent = '';
    } else if (tag === 'pre') {
      $('article').append(`<${ tag }><code>${ text }</code></${ tag }>`);
    } else {
      $('article').append(`<${ tag }>${ text }</${ tag }>`);
    }
  }

  if (listContent) {
    $('article').append(`<ul>${ listContent }</ul>`);
  }

  return $.html();
}
