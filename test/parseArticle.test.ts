import fs from 'fs';
import { parseArticle } from "../src/functions/parseArticle";
import { SourceType } from "@prisma/client";
import { expect, describe, it } from "@jest/globals";

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

  it('main title in business insider', () => {
    // https://businessinsider.com.pl/prawo/prawnik-bankow-opinia-rzecznika-tsue-w-sprawie-c-52021-jest-sprzeczna/j2k38xl
    const html = fs.readFileSync(__dirname + '/bi2.article.html').toString()
    expect(typeof html).toEqual('string');
    const article = parseArticle(html, SourceType.buisnesinsider);
    expect(article.title).toEqual('Opinia rzecznika TSUE jest wewnętrznie sprzeczna. Prawnik banków: poczekajmy na wyrok')
  })

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

    const preWithDates = res.find(cmp => cmp.text.startsWith('2019-08-13'));
    expect(preWithDates).toBeDefined();

    const preWithRust = res.find(cmp => cmp.xpath.includes('pre') && cmp.text.includes('use std::io;'))
    expect(preWithRust).toBeDefined();

    expect(preWithRust?.text).toStrictEqual(`use linear_sort_reverse_search_rust_easy::reverse_search;
use std::io;

fn main() -> io::Result<()> {
    reverse_search(&mut io::stdin(), &mut io::stdout())
}`);


    expect(res[res.length - 1].text).toContain('Screenshot from my console');
  })

  it('see also', () => {
    const html = fs.readFileSync(__dirname + '/bi3.article.html').toString()
    const article = parseArticle(html, SourceType.buisnesinsider);

    expect(article.title).toEqual('Takich tłumów na lotnisku w Radomiu dawno nie było. Przygotowują się na każdą ewentualność');
    // expect(article.components.length).toEqual(7);
    expect(article.components.some(c => c.text.startsWith('Dalsza część artykułu'))).toBeFalsy();
    expect(article.components.some(c => c.text.startsWith('Zobacz także: Lotnisko w Radomiu. LOT uruchomił sprzedaż biletów. Podał datę pierwszego rejsu'))).toBeFalsy();
    expect(article.components.some(c => c.text.startsWith('Zobacz także: Budowa nowego terminalu lotniska Radom-Warszawa oficjalnie zakończona'))).toBeFalsy();
  })
})
