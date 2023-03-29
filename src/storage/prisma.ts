import {PrismaClient} from '@prisma/client';

let dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/aic'

if (process.env.NODE_ENV === 'test' && !dbUrl.endsWith('_test')) {
  dbUrl += '_test'
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  }
});
