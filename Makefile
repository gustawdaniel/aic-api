include .env
export

up:
	npx ts-node-dev --no-notify --respawn --transpile-only --watch src src/index.ts
