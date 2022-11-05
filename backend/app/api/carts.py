from typing import Any, Generator
from uuid import UUID

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_user
from app.deps.db import get_db
from app.models.cart import Cart
from app.models.user import User
from app.schemas.cart import CreateCart, GetCart
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetCart, status_code=status.HTTP_200_OK)
def get_cart(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    carts = session.execute(
        """
        SELECT products.id, array_agg(json_build_object('size', sizes.size, 'quantity', carts.quantity)) as details,
        products.price, images.image_url as image, products.title as name FROM only carts
        JOIN product_size_quantities ON product_size_quantities.id = product_size_quantity_id
        JOIN sizes ON sizes.id  = product_size_quantities.size_id
        JOIN products ON products.id = product_size_quantities.product_id
        JOIN product_images ON product_images.product_id = products.id
        JOIN images ON images.id = product_images.image_id
        WHERE user_id = :user_id AND images.image_url LIKE '%-1.webp'
        GROUP BY products.id, products.price, image, name
        """,
        {"user_id": current_user.id},
    ).fetchall()

    return GetCart(data=carts)


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_cart(
    request: CreateCart,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:

    existed_cart = session.execute(
        """
        SELECT carts.id as cart_id, * FROM carts
        JOIN product_size_quantities ON product_size_quantities.product_id = :product_id AND
        product_size_quantities.size_id = (SELECT sizes.id FROM sizes WHERE sizes.size = :size)
        WHERE carts.user_id = :user_id AND carts.product_size_quantity_id = product_size_quantities.id
        """,
        {
            "user_id": current_user.id,
            "product_id": request.product_id,
            "size": request.size,
        },
    ).fetchone()

    if existed_cart:
        cart = session.query(Cart).filter(Cart.id == existed_cart.cart_id).first()
        cart.quantity += request.quantity
        session.commit()

        return DefaultResponse(message=f"Cart updated {existed_cart.cart_id}")

    else:
        session.execute(
            """
            INSERT INTO carts (user_id, product_size_quantity_id, quantity)
            VALUES (:user_id, (SELECT product_size_quantities.id FROM product_size_quantities
            JOIN products ON products.id = product_size_quantities.product_id
            JOIN sizes ON sizes.id = product_size_quantities.size_id
            WHERE products.id = :product_id AND sizes.size = :size), :quantity)
            """,
            {
                "user_id": current_user.id,
                "product_id": request.product_id,
                "size": request.size,
                "quantity": request.quantity,
            },
        )

        logger.info(
            f"User {current_user.name} added product {request.product_id} to cart"
        )

        return DefaultResponse(message="Cart created")


@router.delete(
    "/{cart_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def delete_cart(
    cart_id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:

    cart = session.query(Cart).filter(Cart.id == cart_id).first()
    session.delete(cart)
    session.commit()

    logger.info(f"Cart {cart_id} deleted by {current_user.name}")

    return DefaultResponse(message="Cart deleted")
