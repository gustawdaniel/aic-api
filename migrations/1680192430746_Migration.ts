import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';
import { getArticleTitle } from "../src/functions/getArticleTitle";

export class Migration1680192430746 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.collection('requests').updateMany({}, {
      $unset: {
        html: 1
      }
    });
    const articles = await db.collection('articles').find().toArray();
    for (const article of articles) {
      const request = await db.collection('requests').findOne({
        _id: article.request_id
      });
      await db.collection('articles').updateOne({
        _id: article._id
      }, {
        $set: {
          //@ts-ignore
          title: getArticleTitle({components: article.components}),
          source_url: request ? request.url : ''
        }
      })
    }
  }

  public async down(db: Db): Promise<any> {
    await db.collection('requests').updateMany({}, {
      $set: {
        html: ''
      }
    });
    await db.collection('articles').updateMany({}, {
      $unset: {
        title: '',
        source_url: ''
      }
    });

  }
}
