import { articles } from "@prisma/client";

export function getArticleTitle(article: Pick<articles, 'components' | 'title'>): string {
  if(article.title && article.title.length) return article.title;
  const header = article.components.find((el) => el.xpath.includes('h1'));
  if (header) return header.text;
  const header2 = article.components.find((el) => el.xpath.includes('h2'));
  if (header2) return header2.text;
  const any = article.components.find(() => true);
  if (any) return any.text;
  return 'Empty article...'
}
