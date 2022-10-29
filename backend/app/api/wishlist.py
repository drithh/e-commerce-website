from typing import Generator
from uuid import UUID

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.request_params import DefaultResponse
from app.schemas.sale import GetSales
from app.schemas.wishlist import GetWishlist

router = APIRouter()


@router.get("", response_model=GetWishlist, status_code=status.HTTP_200_OK)
def get_wishlist(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    wishlists = session.execute(
        """
        SELECT *, images.image_url as image FROM wishlists
        JOIN products ON products.id = wishlists.product_id
        JOIN product_images ON product_images.product_id = products.id
        JOIN images ON images.id = product_images.image_id
        WHERE user_id = :user_id AND images.image_url LIKE '%-1.webp'
        """,
        {"user_id": current_user.id},
    ).fetchall()

    return GetWishlist(data=wishlists)


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_wishlist(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    session.add(Wishlist(user_id=current_user.id, product_id=id))
    session.commit()

    logger.info(f"User {current_user.name} added product {id} to wishlist")

    return DefaultResponse(message="Wishlist created")


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_wishlist(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    session.query(Wishlist).filter(
        Wishlist.user_id == current_user.id, Wishlist.product_id == id
    ).delete()
    session.commit()

    logger.info(f"User {current_user.name} removed product {id} from wishlist")

    return DefaultResponse(message="Wishlist deleted")
