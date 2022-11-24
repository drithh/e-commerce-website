import math
from typing import Any, Generator

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.schemas.admin import (
    GetCustomers,
    GetDashboard,
    GetOrders,
    GetSales,
    Pagination,
)
from app.schemas.default_model import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetSales, status_code=status.HTTP_200_OK)
def get_sales(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    total_sales = session.execute(
        """
        SELECT SUM(price * quantity) total_sales
        FROM order_items
        JOIN orders ON order_items.order_id = orders.id
        WHERE orders.status = 'completed'
        """
    ).fetchone()[0]

    total_order = session.execute(
        """
        SELECT COUNT(*) FROM orders
        """
    ).fetchone()[0]

    total_user = session.execute(
        """
        SELECT COUNT(*) FROM users WHERE is_admin = false
        """
    ).fetchone()[0]

    if not total_sales:
        total_sales = 0
    if not total_order:
        total_order = 0
    if not total_user:
        total_user = 0

    return GetSales(
        data={
            "total_sales": total_sales,
            "total_order": total_order,
            "total_user": total_user,
        }
    )


@router.get("/dashboard", response_model=GetDashboard, status_code=status.HTTP_200_OK)
def get_dashboard(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:

    income_per_month = session.execute(
        """
        SELECT TO_CHAR(orders.created_at, 'Mon') AS month,
        DATE_TRUNC('month', orders.created_at) AS month_date,
        SUM(order_items.price * order_items.quantity / 1000) income
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        WHERE orders.status = 'completed'
        GROUP BY month, month_date
        ORDER BY month_date DESC
        LIMIT 12
        """
    ).fetchall()

    # total completed order in this year per category
    total_order_per_category = session.execute(
        """
        SELECT categories.title, COUNT(orders.id) total_order
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
        JOIN products ON product_size_quantities.product_id = products.id
        JOIN categories ON products.category_id = categories.id
        WHERE orders.status = 'completed' AND DATE_PART('year', orders.created_at) = DATE_PART('year', CURRENT_DATE)
        GROUP BY categories.id
        """
    ).fetchall()

    return GetDashboard(
        income_per_month=income_per_month[::-1],
        total_order_per_category=total_order_per_category,
    )


@router.get("/customer", response_model=GetCustomers, status_code=status.HTTP_200_OK)
def get_customer(
    session: Generator = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    customers = session.execute(
        """
        SELECT users.name, users.id, users.email, COUNT(orders.id) total_order,
        COALESCE(SUM(order_items.price * order_items.quantity), 0) total_spent,
        COALESCE(TO_CHAR(MAX(orders.created_at), 'YYYY-MM-DD'), 'Never') last_order,
        COUNT(*) OVER() totalrow_count
        FROM ONLY users
        LEFT JOIN ONLY orders ON users.id = orders.user_id
        LEFT JOIN ONLY order_items ON orders.id = order_items.order_id AND orders.status = 'completed'
        WHERE is_admin = false
        GROUP BY users.id
        OFFSET :offset LIMIT :limit
        """,
        {
            "offset": (page - 1) * page_size,
            "limit": page_size,
        },
    ).fetchall()

    if not customers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="You don't have any customer"
        )

    return GetCustomers(
        data=customers,
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_item=customers[0].totalrow_count if customers else 0,
            total_page=math.ceil(customers[0].totalrow_count / page_size)
            if customers
            else 1,
        ),
    )


@router.get("/order", response_model=GetOrders, status_code=status.HTTP_200_OK)
def get_order(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    orders = session.execute(
        """
        SELECT orders.id, users.name, users.email, orders.status,
        orders.address, DATE(orders.created_at) created_at,
        SUM(order_items.price * order_items.quantity) total_price,
        SUM(order_items.quantity) total_product,
        COUNT(*) OVER() totalrow_count
        FROM ONLY orders
        JOIN ONLY users ON orders.user_id = users.id
        JOIN ONLY order_items ON orders.id = order_items.order_id
        GROUP BY orders.id, users.id
        OFFSET :offset LIMIT :limit
        """,
        {
            "offset": (page - 1) * page_size,
            "limit": page_size,
        },
    ).fetchall()

    if not orders:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="You don't have any order"
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
