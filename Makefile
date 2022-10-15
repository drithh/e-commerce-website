include .env

APP=docker-compose exec backend


seed:
	$(APP) python app/seeder.py 