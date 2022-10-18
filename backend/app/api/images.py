from typing import Any, Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

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
    return session.query(Image).filter(Image.name.like(f"%{image_name}%")).first()
