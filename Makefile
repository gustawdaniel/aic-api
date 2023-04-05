include .env
export

up:
	npx tsx watch src/index.ts

mock:
	npx tsx watch src/mock.ts

.ONESHELL:
sync-prisma:
	npx prisma format
	npx prisma validate
	rm -rf prisma/generated
	npx prisma generate
	mkdir -p ../scraping/prisma
	rsync -a "prisma/schema.prisma" "../scraping/prisma"
	cd ../scraping
	npx prisma generate
