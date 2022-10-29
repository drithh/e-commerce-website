from typing import Generator

from fastapi import Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.category import Category
from app.models.image import Image
from app.models.user import User
from app.schemas.category import DeleteCategory, GetCategory, SetImage, UpdateCategory
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCategory, status_code=status.HTTP_200_OK)
def get_category(
    session: Generator = Depends(get_db),
):
    return GetCategory(data=session.query(Category).all())


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_name: str = Query(..., min_length=2, max_length=100),
):

    session.add(Category(title=category_name))
    session.commit()
    logger.info(f"Category {category_name} created by {current_user.name}")

    return DefaultResponse(message="Category added")


@router.put(
    "{category_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def update_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_id: UpdateCategory = Depends(UpdateCategory),
    category_name: str = Query(..., min_length=2, max_length=100),
):
    session.query(Category).filter(Category.id == category_id.id).update(
        {"title": category_name}
    )
    session.commit()
    logger.info(f"Category {category_name} updated by {current_user.name}")

    return DefaultResponse(message="Category updated")


@router.delete(
    "{category_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def delete_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_id: DeleteCategory = Depends(DeleteCategory),
):
    session.query(Category).filter(Category.id == category_id.id).delete()
    session.commit()
    logger.info(f"Category {Category.title} deleted by {current_user.name}")

    return DefaultResponse(message="Category deleted")
