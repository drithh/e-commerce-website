from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.deps.sql_error import format_error
from app.models.category import Category
from app.models.image import Image
from app.models.user import User
from app.schemas.category import (
    DeleteCategory,
    DetailCategory,
    GetCategory,
    UpdateCategory,
)
from app.schemas.default_model import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCategory, status_code=status.HTTP_200_OK)
def get_category(
    session: Generator = Depends(get_db),
):
    categories = session.query(Category).all()

    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There are no categories",
        )

    return GetCategory(data=categories)


@router.get("/detail", response_model=DetailCategory, status_code=status.HTTP_200_OK)
def get_detail_category(
    category_id: UUID,
    session: Generator = Depends(get_db),
):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_name: str = Query(..., min_length=2, max_length=100),
):
    try:
        session.add(Category(title=category_name))
        session.commit()
    except Exception as e:
        logger.error(format_error(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )
    logger.info(f"Category {category_name} created by {current_user.name}")

    return DefaultResponse(message="Category added")


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_category(
    category_id: UUID,
    request: UpdateCategory,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    category.title = request.title
    category.type = request.type

    session.commit()

    logger.info(f"Category {request.title} updated by {current_user.name}")

    return DefaultResponse(message="Category updated")


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_category(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
    category_id: DeleteCategory = Depends(DeleteCategory),
):
    try:
        session.query(Category).filter(Category.id == category_id.id).delete()
        session.commit()
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    logger.info(f"Category {Category.title} deleted by {current_user.name}")

    return DefaultResponse(message="Category deleted")
