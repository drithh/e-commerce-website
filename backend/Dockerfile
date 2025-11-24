FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100
RUN pip install asyncpg poetry==1.4.2 "numpy<2" opencv-python-headless torch==1.13.0 torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu

COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app

EXPOSE 8000

CMD uvicorn --port 8000 --host 0.0.0.0 main:app
