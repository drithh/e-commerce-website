import math
from typing import Generator

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.schemas.dashboard import GetCustomers, GetDashboard, GetOrders, Pagination
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("/customer", response_model=GetCustomers, status_code=status.HTTP_200_OK)
def get_customer(
    session: Generator = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    current_user: User = Depends(get_current_active_admin),
):
    customers = session.execute(
        """
        SELECT users.name, users.id, users.email, COUNT(orders.id) total_order,
        SUM(order_items.price * order_items.quantity) total_spent,
        DATE(MAX(orders.created_at)) last_order,
        COUNT(*) OVER() totalrow_count
        FROM only users
        JOIN orders ON users.id = orders.user_id
        JOIN order_items ON orders.id = order_items.order_id
        WHERE is_admin = false AND orders.status = 'completed'
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
            status_code=status.HTTP_404_NOT_FOUND, detail="No customer found"
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
):
    orders = session.execute(
        """
        SELECT orders.id, users.name, users.email, orders.status,
        orders.address, DATE(orders.created_at) created_at,
        SUM(order_items.price * order_items.quantity) total_price,
        SUM(order_items.quantity) total_product,
        COUNT(*) OVER() totalrow_count
        FROM orders
        JOIN users ON orders.user_id = users.id
        JOIN order_items ON orders.id = order_items.order_id
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
            status_code=status.HTTP_404_NOT_FOUND, detail="No order found"
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


@router.get("/dashboard", response_model=GetDashboard, status_code=status.HTTP_200_OK)
def get_dashboard(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
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
        total_user=total_user,
        total_order=total_order,
        income_per_month=income_per_month[::-1],
        total_order_per_category=total_order_per_category,
    )
