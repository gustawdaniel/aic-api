import { fixUrl } from "../src/routes/Source";
import { SourceType } from "@prisma/client";

describe('fixUrl', () => {
  it('feed absent', () => {
    expect(fixUrl('https://businessinsider.com.pl/gospodarka', SourceType.buisnesinsider)).toEqual('https://businessinsider.com.pl/gospodarka.feed')
  });
  it('feed appended', () => {
    expect(fixUrl('https://businessinsider.com.pl/gospodarka.feed\t', SourceType.buisnesinsider)).toEqual('https://businessinsider.com.pl/gospodarka.feed')
  })
  it('blog', () => {
    expect(fixUrl('https://gustawdaniel.com', SourceType.ghost)).toEqual('https://gustawdaniel.com/news/rss')
  })
  it('no https', () => {
    expect(fixUrl('gustawdaniel.com', SourceType.ghost)).toEqual('https://gustawdaniel.com/news/rss')
  })
})
