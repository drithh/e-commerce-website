from sqlalchemy.exc import IntegrityError, OperationalError, ProgrammingError

from app.core.logger import logger


def format_error(error: Exception) -> str:
    if isinstance(error, IntegrityError):
        return f"IntegrityError: {format_integrity_error(error)}"
    elif isinstance(error, OperationalError):
        return "OperationalError: {}".format(error.orig)
    elif isinstance(error, ProgrammingError):
        return "ProgrammingError: {}".format(error.orig)
    else:
        return "Unknown error: {}".format(error)


def format_integrity_error(error: IntegrityError):
    return (
        str(error)
        .replace("\\", "")
        .replace('"', "")
        .replace("  ", " ")
        .split("\n\n")[0]
        .replace("\n", ". ")
        .strip()
    )
