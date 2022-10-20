from typing import Any, Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.db import get_db
from app.models.banner import Banner
from app.models.category import Category
from app.models.image import Image
from app.schemas.home import GetBanners, GetCategories
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("/banner", response_model=GetBanners, status_code=status.HTTP_200_OK)
def get_banner(
    session: Generator = Depends(get_db),
) -> Any:
    return {
        "data": session.query(Banner.id, Image.image_url.label("image"), Banner.title)
        .join(Image, Banner.image_id == Image.id)
        .all()
    }


@router.get("/category", response_model=GetCategories, status_code=status.HTTP_200_OK)
def get_category(
    session: Generator = Depends(get_db),
) -> Any:
    return {
        "data": session.query(
            Category.id, Image.image_url.label("image"), Category.title
        )
        .join(Image, Category.image_id == Image.id)
        .all()
    }
