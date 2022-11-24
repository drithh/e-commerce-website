import secrets
import string
from typing import Any

from app.deps.authentication import create_access_token
from app.models.user import User


def generate_random_string(length: int) -> str:
    return "".join(secrets.choice(string.ascii_lowercase) for i in range(length))


def get_jwt_header(user: User) -> Any:
    return {"Authorization": f"Bearer {create_access_token({'sub': user.email})}"}
