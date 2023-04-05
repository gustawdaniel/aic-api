import { getArticleHtmlContent } from "../src/functions/getArticleHtmlContent";

describe('articles', () => {
  it('getArticleHtmlContent', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'Hello world',
          xpath: ['h1'],
          finish_reason: 'stop',
          ai_requests: [],
        },
        {
          id: '2',
          text: 'I love you',
          xpath: ['p'],
          finish_reason: 'stop',
          ai_requests: [],
        }
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><p>I love you</p></article></body></html>`)
  })

  it('getArticleHtmlContent with list', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'Hello world',
          xpath: ['h1'],
          finish_reason: 'stop',
          ai_requests: [],
        },
        {
          id: '2',
          text: 'I love you',
          xpath: ['li'],
          finish_reason: 'stop',
          ai_requests: [],
        }
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><ul><li>I love you</li></ul></article></body></html>`)
  })


  it('getArticleHtmlContent pre', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: '1 + 2 = 3',
          xpath: ['pre'],
          finish_reason: 'stop',
          ai_requests: [],
        },
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><pre><code>1 + 2 = 3</code></pre></article></body></html>`)
  })


})
