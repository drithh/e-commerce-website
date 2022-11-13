include .env

APP=docker-compose run backend
EXEC=docker-compose exec backend
MIGRATE=docker-compose run --rm backend poetry run alembic

seed:
	$(EXEC) poetry run python -m app.seeders.seeder
dearchive:
	$(EXEC) poetry run python -m app.util.dearchive
drop-tables:
	$(EXEC) poetry run python -m app.util.drop-tables

create-apptest:
	docker compose exec postgres createdb apptest -U postgres
	docker compose exec postgres psql -U postgres -d apptest -f docker-entrypoint-initdb.d/extension.sql

test-api:
	docker compose exec backend pytest tests/api

test-model:
	docker compose exec backend pytest tests/models

test:
	docker compose exec backend pytest

migrate-up:
		$(MIGRATE) upgrade head
migrate-down:
		$(MIGRATE) downgrade -1

create:
		@read -p  "What is the name of migration?" NAME; \
		${MIGRATE} revision --autogenerate -m $$NAME

pre-commit:
		pre-commit run --all-files
