import { Component } from "@prisma/client";
import * as cheerio from 'cheerio';
import { parse } from 'url';
import querystring from "querystring";

function skipTitle(components: Component[]): Component[] {
  return components.filter((c, i) => i !== 0 || !c.xpath.includes('h1'));
}

export function cleanUrl(url: string): string {
  const parsed = parse(url);

  const searchMap = new Map(parsed.search ? Object.entries(querystring.parse(parsed.search.replace(/^\?/,''))): []);
  searchMap.delete('ref');

  const search = parsed.search ? querystring.stringify({
    ...(Object.fromEntries(searchMap))
  }) : '';

  return `${ parsed.protocol }//${ parsed.host }${ parsed.pathname }${parsed.pathname?.endsWith('/') ? '' : '/'}${ search }`;
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
    }

    if (tag === 'img') {
      $('article').append(`<figure><img src="${ text }"></figure>`);
    } else if (tag === 'pre') {
      $('article').append(`<${ tag }><code>${ text }</code></${ tag }>`);
    } else if (tag === 'figure') {
      const subtag = xpath.length >= 2 ? xpath[1] : '';
      if (subtag === 'img') {
        $('article').append(`<${ tag }><img src="${ text }"></${ tag }>`);
      } else if (subtag === 'a') {
        $('article').append(`<p><a href="${ cleanUrl(text) }">${ cleanUrl(text) }</a></p>`);
      } else {
        $('article').append(`<${ tag }>${ text }</${ tag }>`);
      }
    } else if(tag !== 'li') {
      $('article').append(`<${ tag }>${ text }</${ tag }>`);
    }
  }

  if (listContent) {
    $('article').append(`<ul>${ listContent }</ul>`);
  }

  return $.html();
}
