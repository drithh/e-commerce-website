from typing import Any

from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.deps.db import get_async_session
from app.models.image import Image
from app.schemas.image import ImageBase

router = APIRouter()


@router.get("/{image_name}", response_model=ImageBase, status_code=200)
async def get_images(
    image_name: str,
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    items = (
        await session.execute(select(Image).filter(Image.name.like(f"%{image_name}%")))
    ).first()

    return items.Image
