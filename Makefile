include .env

APP=docker-compose run backend
EXEC=docker-compose exec backend
MIGRATE=docker-compose run --rm backend poetry run alembic

seed:
	$(EXEC) poetry run python -m app.seeders.seeder
dearchive:
	$(EXEC) poetry run python -m app.dearchive
migrate-up:
		$(MIGRATE) upgrade head
migrate-down:
		$(MIGRATE) downgrade -1

create:
		@read -p  "What is the name of migration?" NAME; \
		${MIGRATE} revision --autogenerate -m $$NAME

pre-commit:
		pre-commit run --all-files
