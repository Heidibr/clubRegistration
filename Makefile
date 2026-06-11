.PHONY: dev build lint preview api-types test up down

dev:
	pnpm run dev

build:
	pnpm run build

lint:
	pnpm run lint

preview:
	pnpm run preview

api-types:
	pnpm run api:types

test:
	cd tests && npm test

up:
	docker compose up --build

down:
	docker compose down
