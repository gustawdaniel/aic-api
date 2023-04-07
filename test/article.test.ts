import { Article } from "../src/models/Article";
import { User } from "../src/models/User";
import { prisma } from "../src/storage/prisma";
import { purgeDb } from "../src/storage/purgeDb";
import { mongoStringFromSeed } from "../src/storage/mongo";
import assert from "node:assert";
import { redis } from "../src/storage/ioredis";

describe('article evolution', () => {
  beforeAll(async () => {
    await purgeDb()
  })

  afterAll(async () => {
    await redis.disconnect()
    await prisma.$disconnect()
  })

  it('hash', () => {
    expect(Article.computeHash({
      title: 'hello',
      state: 'new',
      components: [ { id: '1', xpath: ['p'], ai_requests: [], text: 'hello', finish_reason: 'stop' } ],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    })).toEqual(Article.computeHash({
      title: 'hello',
      components: [ { id: '1', xpath: ['p'], ai_requests: [], text: 'hello', finish_reason: 'stop' } ],
      state: 'new',
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    }))
  })

  it('create art', async () => {
    await User.createTestUser();
    const article = await new Article({id: mongoStringFromSeed("1")}).create({
      data: {
        title: 'hello',
        components: [{
          id: '1',
          text: "hello",
          xpath: ["p"],
          finish_reason: 'stop',
          ai_requests: [],
        }],
      }
    });

    const count = await prisma.articles.count()
    expect(count).toStrictEqual(1);

    const fix = {
      title: 'hello world',
      components: [{
        id: '1',
        ai_requests: [],
        text: "hello world",
        xpath: ["p"],
        finish_reason: 'stop'
      }]
    }

    await new Article({id: mongoStringFromSeed("1")}).update(article.id, fix);

    const updatedArticle = await prisma.articles.findUnique({where: {id: article.id}});
    expect(updatedArticle).not.toBeNull();
    assert(updatedArticle)
    expect(updatedArticle.components).toHaveLength(1);
    expect(updatedArticle.components.every((c) => c.text === 'hello world')).toBeTruthy();

    expect(updatedArticle.versions).toHaveLength(2);

    const initialHash = updatedArticle.versions[0].hash;

    await new Article({id: mongoStringFromSeed("1")}).commit(article.id, initialHash);

    const finalArticle = await prisma.articles.findUnique({where: {id: article.id}});
    expect(finalArticle).not.toBeNull();
    assert(finalArticle)
    expect(finalArticle.components).toHaveLength(1);
    expect(finalArticle.components.every((c) => c.text === 'hello')).toBeTruthy();

    expect(finalArticle.versions).toHaveLength(3);
    expect(finalArticle.versions[0].hash).toStrictEqual(finalArticle.versions[2].hash);
  })
})

