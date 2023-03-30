export function createLinkHeader(url: string, page: number, limit: number, totalCount: number) {
  const lastPage = Math.ceil(totalCount / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  const links = [];

  if(prevPage && prevPage > 1) {
    links.push(`<${ url }?page=${ 1 }&limit=${ limit }>; rel="first"`);
  }

  if (prevPage) {
    links.push(`<${ url }?page=${ prevPage }&limit=${ limit }>; rel="prev"`);
  }

  if (nextPage) {
    links.push(`<${ url }?page=${ nextPage }&limit=${ limit }>; rel="next"`);
  }

  if(nextPage && nextPage < lastPage) {
    links.push(`<${ url }?page=${ lastPage }&limit=${ limit }>; rel="last"`);
  }

  return links.join(', ');
}
