.PHONY: dev build lint preview api-types test up down

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

preview:
	npm run preview

api-types:
	npm run api:types

test:
	cd tests && npm test

up:
	docker compose up --build

down:
	docker compose down
