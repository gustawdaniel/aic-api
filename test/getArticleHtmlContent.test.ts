import { cleanUrl, getArticleHtmlContent } from "../src/functions/getArticleHtmlContent";

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

  it('getArticleHtmlContent img', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'https://example.com/image.png',
          xpath: ['img'],
          finish_reason: 'stop',
          ai_requests: [],
        },
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><figure><img src="https://example.com/image.png"></figure></article></body></html>`)
  })

  it('getArticleHtmlContent img', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'https://example.com/image.png',
          xpath: ['img'],
          finish_reason: 'stop',
          ai_requests: [],
        },
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><figure><img src="https://example.com/image.png"></figure></article></body></html>`)
  })

  it('getArticleHtmlContent p + figure > img', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'Hello world',
          xpath: ['p'],
          finish_reason: 'stop',
          ai_requests: [],
        },
        {
          id: '2',
          text: 'https://example.com/image.png',
          xpath: ['figure','img'],
          finish_reason: 'stop',
          ai_requests: [],
        },
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><p>Hello world</p><figure><img src="https://example.com/image.png"></figure></article></body></html>`)
  });

  it('cleanUrl', () => {
    expect(cleanUrl('https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/?ref=preciselab.io')).toEqual('https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/')
  })

  it('p after li', () => {
    const content = getArticleHtmlContent({
      components: [
        {
          id: '1',
          text: 'using dnf for yum repos works',
          xpath: ['li'],
          finish_reason: 'stop',
          ai_requests: [],
        },
        {
          id: '2',
          text: 'Now you have to start mongod service',
          xpath: ['p','code'],
          finish_reason: 'stop',
          ai_requests: [],
        },
        {
          id: '3',
          text: 'sudo systemctl start mongod',
          xpath: ['pre','code'],
          finish_reason: 'stop',
          ai_requests: [],
        },
      ]
    });

    expect(content).toEqual(`<html><head></head><body><article><ul><li>using dnf for yum repos works</li></ul><p>Now you have to start mongod service</p><pre><code>sudo systemctl start mongod</code></pre></article></body></html>`)

  });

})
