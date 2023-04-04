include .env
export

up:
	npx tsx watch src/index.ts

mock:
	npx tsx watch src/mock.ts

sync-db:
