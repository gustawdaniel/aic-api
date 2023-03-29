import 'dotenv/config';
import { mongoMigrateCli } from 'mongo-migrate-ts';

console.log(1);

mongoMigrateCli({
    uri: process.env.DATABASE_URL,
    database: 'aic',
    migrationsDir: __dirname,
    migrationsCollection: 'migrations_collection',
});
