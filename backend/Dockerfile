FROM python:3.9-slim

WORKDIR /app

ENV PIP_DEFAULT_TIMEOUT=100
# Install Poetry
RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app

CMD uvicorn --port 8000 --host 0.0.0.0 --reload main:app
