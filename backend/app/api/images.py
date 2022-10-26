from typing import Any, Generator

from fastapi import HTTPException, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_db
from app.models.image import Image
from app.schemas.image import GetImage

router = APIRouter()


@router.get("/{image_name}", response_model=GetImage, status_code=status.HTTP_200_OK)
async def get_image(
    image_name: str,
    session: Generator = Depends(get_db),
) -> Any:
    image_name = image_name.lower()
    image = session.query(Image).filter(Image.name.like(f"%{image_name}%")).first()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    return GetImage(
        name=image.name,
        image_url=f"{settings.CLOUD_STORAGE}/{image.image_url}",
    )
