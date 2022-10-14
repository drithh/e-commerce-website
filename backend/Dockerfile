FROM python:3.9-slim

WORKDIR /app

# Install Poetry
RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app

CMD uvicorn --host 0.0.0.0 --port 8000 main:app
