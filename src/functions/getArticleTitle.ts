import { articles } from "@prisma/client";

export function getArticleTitle(article: Pick<articles, 'components'>): string {
  const header = article.components.find((el) => el.xpath.includes('h1'));
  if (header) return header.text;
  const header2 = article.components.find((el) => el.xpath.includes('h2'));
  if (header2) return header2.text;
  const any = article.components.find(() => true);
  if (any) return any.text;
  return 'Empty article... Probably there is bug in scraping. Please write to support.'
}
