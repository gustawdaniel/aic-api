"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongo_migrate_ts_1 = require("mongo-migrate-ts");
(0, mongo_migrate_ts_1.mongoMigrateCli)({
    uri: process.env.DATABASE_URL,
    database: 'aic',
    migrationsDir: __dirname,
    migrationsCollection: 'migrations_collection',
});
