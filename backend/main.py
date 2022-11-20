import logging

import uvicorn

from app.factory import create_app

app = create_app()

logger = logging.getLogger("uvicorn")
console_formatter = uvicorn.logging.DefaultFormatter(
    fmt="%(levelprefix)s (%(name)s) %(message)s"
)
logger.handlers[0].setFormatter(console_formatter)
logging.basicConfig(level=logging.DEBUG, handlers=logger.handlers)


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting uvicorn in reload mode")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        reload=True,
        port=int("8000"),
    )
