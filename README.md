# e-commerce-website

This is a simple e-commerce website built with fastapi and react.

### live demo:

Website: https://projectakhir.me
API: https://api.projectakhir.me

See our API documentation here: https://api.projectakhir.me/docs

## Technologies used

- FastAPI
- SQLAlchemy and Alembic
- Pre-commit hooks (black, autoflake, isort, flake8, prettier)
- Github Action
- Docker images

## Project structure

```
.
├── backend
│   ├── alembic  -> Database migrations
│   ├── app
│   │   ├── api  -> API endpoints
│   │   │   ├── authentications.py
│   │   │   ├── carts.py
│   │   │   ├── ...
│   │   │   ├── sales.py
│   │   │   └── users.py
│   │   ├── image_classification  -> Image classification model
│   │   │   ├── development -> Development environment
│   │   │   ├── pipeline -> Pipeline for classification model
│   │   │   │   ├── main.py -> Pipeline main file
│   │   │   │   └── model.py -> Model definition
│   │   │   └── utils -> Utility functions
│   │   ├── core  -> Config and Utils
│   │   │   ├── config.py
│   │   │   └── logger.py
│   │   ├── deps  -> API Dependencies
│   │   │   ├── authentication.py
│   │   │   ├── ...
│   │   │   └── request_params.py
│   │   ├── factory.py  -> FastAPI app factory
│   │   ├── models  -> Database models
│   │   │   ├── banner.py
│   │   │   ├── cart.py
│   │   │   ├── ...
│   │   │   └── wishlist.py
│   │   ├── schemas  -> Schemas for request and response
│   │   │   ├── authentication.py
│   │   │   ├── category.py
│   │   │   ├── ...
│   │   │   └── user.py
│   │   └── seeders -> Database seeders
│   │       ├── banner_seeder.py
│   │       ├── cart_seeder.py
│   │       ├── ...
│   │       └── wishlist_seeder.py
│   ├── pyproject.toml -> Package manager
│   ├── sql -> SQL scripts
│   └── tests -> Unit tests
├── frontend -> Frontend
│   ├── package.json -> package manager
│   └── src
│       ├── api -> Generated API client
│       ├── App.tsx  -> Main app
│       ├── assets  -> Assets
│       │   ├── fonts
│       │   └── icons
│       ├── components
│       │   ├── Banner.tsx
│       │   ├── ...
│       │   └── PopoverMenu.tsx
│       ├── context
│       └── pages
│           ├── Checkout.tsx
│           ├── ...
│           └── Wishlist.tsx
├── Makefile  -> Macros for running commands
└── README.md

```

### Step 1: Getting started

Start a local development instance with docker-compose

```bash
docker-compose up -d

# Run database migration
make migrate-up

# Run Seeder
make seed

```

Now you can navigate to the following URLs:

- Backend: http://localhost:8000/v1
- Backend OpenAPI docs: http://localhost:8000/docs/
- Frontend: http://localhost:3000

### Step 2: Setup pre-commit hooks and database

Keep your code clean by using the configured pre-commit hooks. Follow the [instructions here to install pre-commit](https://pre-commit.com/). Once pre-commit is installed, run this command to install the hooks into your git repository:

```bash
pre-commit install
```

### Local development

The backend setup of docker-compose is set to automatically reload the app whenever code is updated.

```bash
cd frontend
npm install
npm start
```

If you want to develop against something other than the default host, localhost:8000, you can set the `REACT_APP_BACKEND_URL` environment variable

Don't forget to edit the .env file and update the BACKEND_CORS_ORIGINS value (add http://mydomain:3000 to the allowed origins).

### Database migrations

Useful commands for database migrations:

```bash
# Auto generate a revision
docker-compose exec backend alembic revision --autogenerate -m 'message'

# Apply latest changes
docker-compose exec backend alembic upgrade head

# Run database migration
make migrate-up

# Run Seeder
make seed

# Dearchive Soft Deleted Field
make dearchive

# Drop all tables
make drop-tables

```

### Backend tests

Backend uses a hardcoded database named apptest, first ensure that it's created

```bash
make test-db
```

Then you can run tests with this command:

```bash
docker-compose exec backend pytest
```

#### Build and upload docker images to a repository

Configure the [**build-push-action**](https://github.com/marketplace/actions/build-and-push-docker-images) in `.github/workflows/test.yaml`.
