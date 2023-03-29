import { prisma } from "../storage/prisma";
import { articles, Prisma, users } from "@prisma/client";
import { createPatch, applyPatch, Operation as RfcOperation } from 'rfc6902'
import assert from "node:assert";
import hash from 'object-hash';

type ArticlePayload = Pick<Prisma.articlesUncheckedCreateInput, 'request_id' | 'components' | 'user_id' | 'state'>;

export class Article {
  private readonly user_id: string

  constructor(user: Pick<users, 'id'>) {
    this.user_id = user.id;
  }

  static computeHash(payload: ArticlePayload): string {
    return hash(payload);
  }

  private getPayload(article: articles): ArticlePayload {
    return {
      state: article.state,
      components: article.components,
      request_id: article.request_id,
      user_id: article.user_id,
    }
  }

  async create({data}: { data: Pick<Prisma.XOR<Prisma.articlesCreateInput, Prisma.articlesUncheckedCreateInput>, 'request_id' | 'components'> }) {
    const payload: Pick<Prisma.articlesUncheckedCreateInput, 'request_id' | 'components' | 'user_id' | 'state'> = {
      user_id: this.user_id,
      request_id: data.request_id ?? null,
      components: data.components,
      state: 'new',
    };

    return prisma.articles.create({
      data: {
        ...payload,
        hash: Article.computeHash(payload),
        versions: {
          hash: Article.computeHash(payload),
          up: createPatch(undefined, payload),
          down: createPatch(payload, undefined)
        }
      }
    })
  }

  private async get(id: string): Promise<articles> {
    const prev = await prisma.articles.findUnique({
      where: {
        id_user_id: {
          id,
          user_id: this.user_id
        }
      }
    });
    if (!prev) throw new Error(`Article: ${ id } not found for user ${ this.user_id }`);
    return prev
  }

  async setProcessingTemplate(id: string, processing_template_id: string) {
    return prisma.articles.update({
      where: {
        id_user_id: {
          id,
          user_id: this.user_id
        }
      },
      data: {
        processing_template_id: processing_template_id
      }
    })
  }

  async update(id: string, payload: Pick<Prisma.articlesUncheckedCreateInput, 'components' | 'state'>) {
    const prev = await this.get(id);

    const old = this.getPayload(prev);

    const fresh: ArticlePayload = {
      ...old,
      ...payload
    }

    const hash = Article.computeHash(fresh)
    if (hash === prev.hash) return prev; // no changes

    const up = createPatch(old, fresh);
    const down = createPatch(fresh, old);

    assert(up.length > 0);
    assert(down.length > 0);

    return prisma.articles.update({
      where: {
        id_user_id: {
          user_id: this.user_id,
          id
        }
      },
      data: {
        hash,
        state: fresh.state,
        components: fresh.components,
        versions: {
          push: {
            hash,
            up,
            down
          }
        }
      }
    })
  }

  async checkout(id: string, hash: string) {
    const prev = await this.get(id);
    const index = prev.versions.findIndex((v) => v.hash === hash);
    if (index < 0) throw new Error(`Hash ${ hash } not found in versions of article ${ id }`);
    const operations = prev.versions.filter((v, i) => i > index).reverse().map((v) => v.down).flat();

    const fresh = this.getPayload(prev);
    const errors = applyPatch(fresh, operations as RfcOperation[]) as unknown as ArticlePayload;
    expect(errors).toEqual([null]);
    assert.strictEqual(Article.computeHash(fresh), hash);
    const up = operations;
    const down = createPatch(fresh, this.getPayload(prev));
    return prisma.articles.update({
      where: {
        id_user_id: {
          user_id: this.user_id,
          id
        }
      },
      data: {
        hash,
        state: fresh.state,
        components: fresh.components,
        versions: {
          push: {
            hash,
            up,
            down
          }
        }
      }
    })
  }
}
