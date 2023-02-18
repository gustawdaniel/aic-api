import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';

export class Migration1676697232404 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.collection('users').updateMany({
      email: 'gustaw.daniel@gmail.com'
    }, {
      $set: {
        roles: ['admin']
      }
    });
    await db.collection('users').updateMany({
      email: {$ne: 'gustaw.daniel@gmail.com'}
    }, {
      $set: {
        roles: []
      }
    });
  }

  public async down(db: Db): Promise<any> {
    await db.collection('users').updateMany({}, {
      $unset: {
        roles: 1
      }
    });
  }
}
