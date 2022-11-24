from typing import Generator
from uuid import UUID

from fastapi import HTTPException, status
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_user
from app.deps.db import get_db
from app.deps.sql_error import format_error
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.default_model import DefaultResponse
from app.schemas.wishlist import GetWishlist

router = APIRouter()


@router.get("", response_model=GetWishlist, status_code=status.HTTP_200_OK)
def get_wishlist(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    wishlists = session.execute(
        f"""
        SELECT wishlists.id, wishlists.product_id, products.title, products.price,
        CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp')) AS image
        FROM only wishlists
        LEFT JOIN products ON products.id = wishlists.product_id
        LEFT JOIN product_images ON products.id = product_images.product_id
        AND product_images.id = (
            SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
        )
        LEFT JOIN images ON images.id = product_images.image_id
        WHERE user_id = :user_id
        """,
        {"user_id": current_user.id},
    ).fetchall()

    return GetWishlist(data=wishlists)


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_wishlist(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    try:
        wishlist = Wishlist(
            user_id=current_user.id,
            product_id=id,
        )
        session.add(wishlist)
        session.commit()
        return DefaultResponse(message="Wishlist Created")
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_wishlist(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    try:
        session.query(Wishlist).filter(
            Wishlist.user_id == current_user.id, Wishlist.product_id == id
        ).delete()
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    logger.info(f"User {current_user.name} removed product {id} from wishlist")

    return DefaultResponse(message="Wishlist deleted")


@router.delete("/all", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def clear_wishlist(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    try:
        session.query(Wishlist).filter(Wishlist.user_id == current_user.id).delete()
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    logger.info(f"User {current_user.name} cleared wishlist")

    return DefaultResponse(message="Wishlist cleared")
