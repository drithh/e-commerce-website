from typing import Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.schemas.request_params import DefaultResponse
from app.schemas.sale import GetSales

router = APIRouter()


@router.get("", response_model=GetSales, status_code=status.HTTP_200_OK)
def get_sales(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    total_sales = session.execute(
        """
        SELECT SUM(price * quantity) total_sales
        FROM order_items
        JOIN orders ON order_items.order_id = orders.id
        WHERE orders.status = 'completed'
        """
    ).fetchone()

    if not total_sales:
        total_sales = 0

    return GetSales(data={"total": total_sales.total_sales})
