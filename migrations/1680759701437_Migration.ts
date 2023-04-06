import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';

export class Migration1680759701437 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.collection('sources').updateMany({type: 'buisnesinsider'}, {$set: {type: 'businessinsider'}})
  }

  public async down(db: Db): Promise<any> {
  }
}
