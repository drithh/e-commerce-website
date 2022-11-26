from typing import Any

from app.deps.authentication import create_access_token
from app.models.user import User


def get_jwt_header(user: User) -> Any:
    return {"Authorization": f"Bearer {create_access_token({'sub': user.email})}"}
