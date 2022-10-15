include .env

APP=docker-compose exec backend
MIGRATE=docker-compose run --rm backend poetry run alembic

seed:
	$(APP) poetry run python -m app.seeders.seeder

migrate-up:
		$(MIGRATE) upgrade head
migrate-down:
		$(MIGRATE) downgrade -1

create:
		@read -p  "What is the name of migration?" NAME; \
		${MIGRATE} revision --autogenerate -m $$NAME
