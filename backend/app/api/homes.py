from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.db import get_db
from app.models.banner import Banner
from app.models.image import Image
from app.schemas.request_params import DefaultResponse
from app.schemas.home import (
    GetBanners,
)
from typing import Any, Generator

router = APIRouter()

@router.get("/banner", status_code=status.HTTP_200_OK)
async def get_banner(
    session: Generator = Depends(get_db),
) -> Any:
    return (
        {"data":
            session.query(Image, Banner)
            .join(Banner)
            .with_entities(Banner.id, Image.image_url, Banner.title)
            .all()
        }
    )