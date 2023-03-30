import querystring from "querystring";
import { parse } from 'url';

function parseUlr(url: string): { baseUrl: string, query: string } {
  const parsedUrl = parse(url);

  return {
    baseUrl: parsedUrl.host ? `${ parsedUrl.protocol }//${ parsedUrl.host }${ parsedUrl.pathname }` : parsedUrl.pathname ?? '',
    query: parsedUrl.query ?? ''
  }
}

function useMergeQuery(query: string) {
  return function (override: Record<string, string | number>): string {
    return querystring.stringify({
      ...querystring.parse(query),
      ...override
    })
  }
}

export function createLinkHeader(url: string, page: number, limit: number, totalCount: number) {
  const lastPage = Math.ceil(totalCount / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  const links = [];

  const {baseUrl, query} = parseUlr(url);
  const mergeQuery = useMergeQuery(query);

  if (prevPage && prevPage > 1) {
    links.push(`<${ baseUrl }?${ mergeQuery({page: 1, limit}) }>; rel="first"`);
  }

  if (prevPage) {
    links.push(`<${ baseUrl }?${ mergeQuery({page: prevPage, limit}) }>; rel="prev"`);
  }

  if (nextPage) {
    links.push(`<${ baseUrl }?${ mergeQuery({page: nextPage, limit}) }>; rel="next"`);
  }

  if (nextPage && nextPage < lastPage) {
    links.push(`<${ baseUrl }?${ mergeQuery({page: lastPage, limit}) }>; rel="last"`);
  }

  return links.join(', ');
}
