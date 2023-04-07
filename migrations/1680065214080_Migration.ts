import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';
import { Article } from "../src/models/Article";
import { Component } from "@prisma/client";

export class Token1680065214080 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const articles = await db.collection('articles').find({
      hash: {$exists: false}
    }).toArray();

    for (const a of articles) {
      await new Article({id: String(a.user_id)}).create({
        // @ts-ignore
        data: {
          components: a.components.map((c: Component): unknown => ({
            text: c.text,
            finish_reason: c.finish_reason,
            xpath: c.xpath
          })),
          request_id: a.request_id ? String(a.request_id) : null
        }
      });

      await db.collection('articles').deleteOne({
        _id: a._id
      })
    }
  }

  public async down(db: Db): Promise<any> {
  }
}
