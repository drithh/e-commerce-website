import math
from typing import Generator
from uuid import UUID

from fastapi import Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from starlette.responses import Response

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.deps.sql_error import format_error
from app.models.user import User
from app.schemas.default_model import DefaultResponse, Pagination
from app.schemas.user import (
    GetOrders,
    GetUser,
    GetUserAddress,
    GetUserBalance,
    PutUserAddress,
    PutUserBalance,
)

router = APIRouter()


@router.get("", response_model=GetUser, status_code=status.HTTP_200_OK)
def get_user(
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    return current_user


@router.get(
    "/shipping_address",
    response_model=GetUserAddress,
    status_code=status.HTTP_200_OK,
)
def get_user_shipping_address(
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    return current_user


@router.get("/balance", response_model=GetUserBalance, status_code=status.HTTP_200_OK)
async def get_user_balance(
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    return current_user


@router.get("/order", response_model=GetOrders, status_code=status.HTTP_200_OK)
def get_orders_user(
    session: Generator = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    orders = session.execute(
        f"""
        SELECT id, created_at, shipping_method, shipping_price, status, shipping_address, city, array_agg(product) products, phone_number,
        COUNT(*) OVER() totalrow_count
        FROM (
            SELECT  orders.id, orders.city, orders.created_at,
            orders.shipping_method, orders.shipping_price, orders.status, orders.address as shipping_address, orders.phone_number,
            json_build_object(
                'id', products.id,
                'details', array_agg(
                        json_build_object(
                            'quantity', order_items.quantity,
                            'size', sizes.size
                    )
                ),
                'price', SUM(order_items.price * order_items.quantity),
                'name', products.title,
                'image', CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))
            ) product
            FROM only orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN sizes ON product_size_quantities.size_id = sizes.id
            JOIN products ON product_size_quantities.product_id = products.id
            LEFT JOIN product_images ON products.id = product_images.product_id
            AND product_images.id = (
                SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
            )
            LEFT JOIN images ON images.id = product_images.image_id
            WHERE orders.user_id = :user_id
            GROUP BY orders.id, products.id, images.id, order_items.price
        ) order_product
        group by order_product.id, order_product.created_at, order_product.shipping_method,
        order_product.shipping_price, order_product.city, order_product.status, order_product.shipping_address, order_product.phone_number
        ORDER BY order_product.created_at DESC
        OFFSET :offset LIMIT :limit
    """,
        {
            "user_id": current_user.id,
            "offset": (page - 1) * page_size,
            "limit": page_size,
        },
    ).fetchall()

    if len(orders) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have no orders",
        )

    return GetOrders(
        data=orders,
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_item=orders[0].totalrow_count if orders else 0,
            total_page=math.ceil(orders[0].totalrow_count / page_size) if orders else 1,
        ),
    )


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_user(
    request: GetUser,
    current_user: User = Depends(get_current_active_admin),
    session: Generator = Depends(get_db),
) -> JSONResponse:
    user = session.query(User).filter(User.id == request.id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.name = request.name
    user.email = request.email
    user.phone_number = request.phone_number
    user.address_name = request.address_name
    user.address = request.address
    user.city = request.city
    user.balance = request.balance
    session.commit()

    return DefaultResponse(message="User updated successfully")


@router.post(
    "/shipping_address", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def update_user_shipping_address(
    request: PutUserAddress,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    current_user.address_name = request.address_name
    current_user.address = request.address
    current_user.city = request.city
    current_user.phone_number = request.phone_number

    session.commit()

    logger.info(f"User {current_user.email} updated shipping address")
    return DefaultResponse(message="Shipping address updated")


@router.post(
    "/balance", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED
)
def update_user_balance(
    request: PutUserBalance,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> JSONResponse:
    if request.balance < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Balance cannot be negative",
        )

    new_balance = int(current_user.balance) + request.balance
    current_user.balance = new_balance
    try:
        session.commit()
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Integer value out of range"
            if "integer out of range" in format_error(e)
            else format_error(e),
        )
    logger.info(f"User {current_user.email} updated balance")
    return DefaultResponse(
        message=f"Your balance has been updated, Current Balance: {new_balance}"
    )


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_user(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    try:
        session.query(User).filter(User.id == id).delete()
        session.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )

    if current_user.id == id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can't delete yourself",
        )

    logger.info(f"User {id} deleted by {current_user.email}")

    return DefaultResponse(message="User deleted successfully")


@router.get("/{id}", response_model=GetUser, status_code=status.HTTP_200_OK)
def get_detail_user(
    id: UUID,
    current_user: User = Depends(get_current_active_admin),
    session: Generator = Depends(get_db),
) -> JSONResponse:
    user = session.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
