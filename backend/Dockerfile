FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100
RUN pip install poetry opencv-python torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu

COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app

CMD uvicorn --port 8000 --host 0.0.0.0 --reload main:app
