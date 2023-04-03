import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';
import { uid } from "uid";

export class Migration1680519109018 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const articles = await db.collection('articles').find().toArray();
    for (const article of articles) {
      await db.collection('articles').updateOne({
        _id: article._id
      }, {
        $set: {
          components: article.components.map((c: any) => {
            return {
              id: c.id ?? uid(),
              xpath: c.xpath,
              text: c.text,
              finish_reason: c.finish_reason,
              ai_requests: c.ai_requests ?? []
            }
          })
        }
      })
    }
  }

  public async down(db: Db): Promise<any> {
  }
}
