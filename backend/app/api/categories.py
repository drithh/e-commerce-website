from typing import Generator
from uuid import UUID

from fastapi import Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.category import Category
from app.models.image import Image
from app.models.user import User
from app.schemas.category import GetCategory, SetImage
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCategory, status_code=status.HTTP_200_OK)
def get_category(
    session: Generator = Depends(get_db),
):
    categories = session.query(Category).all()
    return {"data": categories}


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_name: str = Query(..., min_length=2, max_length=100),
    image: SetImage = Depends(SetImage),
):
    session.add(Image(name=image.name, image_url=image.image_url))
    session.commit()

    session.add(
        Category(
            title=category_name,
            image_id=session.query(Image).filter(Image.name == image.name).first().id,
        )
    )
    session.commit()

    return DefaultResponse(message="Category added")


@router.put(
    "{category_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def update_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_id: UUID = Query(...),
    category_name: str = Query(..., min_length=2, max_length=100),
):
    session.query(Category).filter(Category.id == category_id).update(
        {"title": category_name}
    )
    session.commit()

    return DefaultResponse(message="Category updated")
