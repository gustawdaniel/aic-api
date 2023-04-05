import { Component } from "@prisma/client";
import * as cheerio from 'cheerio';

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
    } else if (tag === 'img') {
      $('article').append(`<figure><img src="${ text }"></figure>`);
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
