from typing import Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import GetCategory
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCategory, status_code=status.HTTP_200_OK)
def get_category(
    session: Generator = Depends(get_db),
):
    categories = session.query(Category).all()
    return {"data": categories}
