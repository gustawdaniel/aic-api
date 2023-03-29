import { Article } from "../src/models/Article";
import { User } from "../src/models/User";
import { prisma } from "../src/storage/prisma";
import { purgeDb } from "../src/storage/purgeDb";
import { mongoStringFromSeed } from "../src/storage/mongo";
import assert from "node:assert";

describe('article evolution', () => {
  beforeAll(async () => {
    await purgeDb()
  })

  it('hash', () => {
    expect(Article.computeHash({
      state: 'new',
      components: [ { xpath: ['p'], text: 'hello', finish_reason: 'stop' } ],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    })).toEqual(Article.computeHash({
      components: [ { xpath: ['p'], text: 'hello', finish_reason: 'stop' } ],
      state: 'new',
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    }))

    expect(Article.computeHash({
      state: 'new',
      components: [ { xpath: ['p'], text: 'hello world', finish_reason: 'stop' } ],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    })).toEqual('af42b98ff44ad88054fe6fff00fe1636e5305fc7')

    expect(Article.computeHash({
      state: 'new',
      components: [ { xpath: ['p'], text: 'hello', finish_reason: 'stop' } ],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    })).toEqual('9b81e36cfb6cf7f97e29dde33c1621ed1640a4ea')
  })

  it('create art', async () => {
    await User.createTestUser();
    const article = await new Article({id: mongoStringFromSeed("1")}).create({
      data: {
        components: [{
          text: "hello",
          xpath: ["p"],
          finish_reason: 'stop'
        }],
      }
    });

    const count = await prisma.articles.count()
    expect(count).toStrictEqual(1);

    const fix = {
      components: [{
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

    await new Article({id: mongoStringFromSeed("1")}).checkout(article.id, initialHash);

    const finalArticle = await prisma.articles.findUnique({where: {id: article.id}});
    expect(finalArticle).not.toBeNull();
    assert(finalArticle)
    expect(finalArticle.components).toHaveLength(1);
    expect(finalArticle.components.every((c) => c.text === 'hello')).toBeTruthy();

    expect(finalArticle.versions).toHaveLength(3);
    expect(finalArticle.versions[0].hash).toStrictEqual(finalArticle.versions[2].hash);
  })
})
