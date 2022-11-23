from typing import Any, Generator
from uuid import UUID

from fastapi import HTTPException, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_user
from app.deps.db import get_db
from app.deps.sql_error import format_error
from app.models.cart import Cart
from app.models.user import User
from app.schemas.cart import CreateCart, GetCart, UpdateCart
from app.schemas.default_model import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCart, status_code=status.HTTP_200_OK)
def get_cart(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    carts = session.execute(
        f"""
        SELECT DISTINCT ON (carts.id) products.id as product_id, carts.id,
        (json_build_object('size', sizes.size, 'quantity', carts.quantity)) as details,
        products.price, CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(image_url, 'image-not-available.webp')) AS image,
        products.title as name FROM only carts
        JOIN product_size_quantities ON product_size_quantities.id = product_size_quantity_id
        JOIN sizes ON sizes.id  = product_size_quantities.size_id
        JOIN products ON products.id = product_size_quantities.product_id
        LEFT JOIN product_images ON products.id = product_images.product_id
        AND product_images.id = (
            SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
        )
        LEFT JOIN images ON images.id = product_images.image_id
        WHERE user_id = :user_id
        GROUP BY products.id, products.price, image, name, carts.id, sizes.size, carts.quantity
        """,
        {"user_id": current_user.id},
    ).fetchall()

    if len(carts) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have no carts",
        )

    return GetCart(data=carts)


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_cart(
    request: CreateCart,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:

    product_size_quantity = session.execute(
        """
            SELECT product_size_quantities.id, products.title, product_size_quantities.quantity FROM only product_size_quantities
            JOIN sizes ON sizes.id = product_size_quantities.size_id
            JOIN products ON products.id = product_size_quantities.product_id
            WHERE product_id = :product_id AND size = :size
        """,
        {"product_id": request.product_id, "size": request.size},
    ).fetchone()

    if product_size_quantity is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product ID or Size is not valid",
        )

    existed_cart = session.execute(
        """
        SELECT carts.id, product_size_quantities.quantity FROM only carts
        JOIN product_size_quantities ON product_size_quantities.id = carts.product_size_quantity_id
        WHERE carts.user_id = :user_id AND product_size_quantities.id = :product_size_quantity_id
        """,
        {
            "user_id": current_user.id,
            "product_size_quantity_id": product_size_quantity.id,
        },
    ).fetchone()

    if existed_cart:
        cart = session.query(Cart).filter(Cart.id == existed_cart.id).first()
        if existed_cart.quantity < request.quantity + cart.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Out of stock, please reduce quantity, current stock is {existed_cart.quantity}",
            )
        cart.quantity += request.quantity
        session.commit()
    else:
        if product_size_quantity.quantity < request.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Out of stock, please reduce quantity, current stock is {product_size_quantity.quantity}",
            )
        cart = Cart(
            user_id=current_user.id,
            product_size_quantity_id=product_size_quantity.id,
            quantity=request.quantity,
        )
        session.add(cart)
        session.commit()

    logger.info(f"User {current_user.name} added product {request.product_id} to cart")

    return DefaultResponse(message=f"Added to cart")


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_cart(
    request: UpdateCart,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:

    cart = session.execute(
        """
        SELECT carts.id, product_size_quantities.quantity as stock, carts.quantity FROM only carts
        JOIN product_size_quantities ON product_size_quantities.id = carts.product_size_quantity_id
        WHERE carts.user_id = :user_id AND carts.id = :cart_id
        """,
        {"user_id": current_user.id, "cart_id": request.id},
    ).fetchone()

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    new_quantity = request.quantity + cart.quantity

    if cart.stock < new_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Out of stock, please reduce quantity, current stock is {cart.stock}",
        )

    if new_quantity > 0:
        try:
            session.execute(
                """
                UPDATE carts SET quantity = :quantity WHERE id = :id
                """,
                {"quantity": cart.quantity + request.quantity, "id": cart.id},
            )
            session.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=format_error(e),
            )
        logger.info(f"User {current_user.name} updated cart {request.id}")

    else:
        try:
            session.execute(
                """
                DELETE FROM carts WHERE id = :id
                """,
                {"id": cart.id},
            )
            session.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=format_error(e),
            )

        logger.info(f"User {current_user.name} deleted cart {request.cart_id}")

    return DefaultResponse(message="Cart updated")


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_cart(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    try:
        cart = session.query(Cart).filter(Cart.id == id).first()
        session.delete(cart)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    logger.info(f"Cart {id} deleted by {current_user.name}")

    return DefaultResponse(message="Cart deleted")


@router.delete("/clear", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def clear_cart(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    try:
        session.execute(
            """
            DELETE FROM carts WHERE user_id = :user_id
            """,
            {"user_id": current_user.id},
        )
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    logger.info(f"Cart cleared by {current_user.name}")

    return DefaultResponse(message="Cart cleared")
