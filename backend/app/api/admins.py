import math
from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.deps.google_cloud import upload_image
from app.deps.image_base64 import base64_to_image
from app.deps.sql_error import format_error
from app.models.banner import Banner
from app.models.image import Image
from app.models.user import User
from app.schemas.admin import (
    CreateBanner,
    GetCustomers,
    GetDashboard,
    GetOrders,
    GetSales,
    Pagination,
    UpdateBanner,
)
from app.schemas.default_model import DefaultResponse

router = APIRouter()


@router.get("/sales", response_model=GetSales, status_code=status.HTTP_200_OK)
def get_sales(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
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
) -> JSONResponse:

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
    sort_by: str = Query(
        "created_at",
        title="Sort by",
        regex="^(name|email|total_order|total_spent|last_order)$",
    ),
    sort_type: str = Query("desc", title="Sort type", regex="^(asc|desc|off)$"),
    session: Generator = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    if sort_by == "created_at":
        sort_by = "users.created_at"
    query = """
        SELECT users.name, users.id, users.email, COUNT(orders.id) total_order,
        COALESCE(SUM(order_items.price * order_items.quantity), 0) total_spent,
        COALESCE(TO_CHAR(MAX(orders.created_at), 'YYYY-MM-DD'), 'Never') last_order,
        COUNT(*) OVER() totalrow_count
        FROM ONLY users
        LEFT JOIN ONLY orders ON users.id = orders.user_id
        LEFT JOIN ONLY order_items ON orders.id = order_items.order_id AND orders.status = 'completed'
        WHERE is_admin = false
        GROUP BY users.id
        """

    if sort_type != "off":
        query += f"ORDER BY {sort_by} {sort_type}"
    query += f" LIMIT {page_size} OFFSET {(page - 1) * page_size}"

    customers = session.execute(
        query, {"page": page, "page_size": page_size}
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
    sort_by: str = Query(
        "created_at",
        regex="^(created_at|name|address|total_product|total_price|status)$",
    ),
    sort_type: str = Query("asc", regex="^(asc|desc|off)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    query = """
        SELECT orders.id, users.name, users.email, orders.status,
        orders.address, DATE(orders.created_at) created_at,
        SUM(order_items.price * order_items.quantity) total_price,
        SUM(order_items.quantity) total_product,
        COUNT(*) OVER() totalrow_count
        FROM ONLY orders
        JOIN ONLY users ON orders.user_id = users.id
        JOIN ONLY order_items ON orders.id = order_items.order_id
        GROUP BY orders.id, users.id
        """
    if sort_type != "off":
        query += f"ORDER BY {sort_by} {sort_type}"
    query += f" LIMIT {page_size} OFFSET {(page - 1) * page_size}"

    orders = session.execute(
        query,
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


@router.post(
    "/banners", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED
)
def create_banner(
    request: CreateBanner,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    if not request.image.startswith("data:image"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Please use base64 format with data:image",
        )
    title_slug = request.title.lower().replace(" ", "-")
    image_data, image_type = base64_to_image(request.image)
    file = {
        "file": image_data,
        "media_type": image_type,
        "file_name": title_slug,
    }
    image_url = upload_image(file, "banners")
    if image_url is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed, because of cloud storage error",
        )

    name = image_url.split("/")[-1].split(".")[0]
    image = Image(name=name, image_url=image_url)
    try:
        session.add(image)
        session.commit()
        session.refresh(image)
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    # create banner
    try:
        banner = Banner(
            title=request.title,
            image_id=image.id,
            url_path=request.url_path,
            text_position=request.text_position,
        )
        session.add(banner)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    return DefaultResponse(message="Banner created successfully")


@router.delete(
    "/banners", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def delete_banner(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    banner = session.query(Banner).filter(Banner.id == id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found"
        )

    try:
        session.delete(banner)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    return DefaultResponse(message="Banner deleted successfully")


@router.put("/banners", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_banner(
    request: UpdateBanner,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    banner = session.query(Banner).filter(Banner.id == request.id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found"
        )

    if request.image:
        if not request.image.startswith("data:image"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format. Please use base64 format with data:image",
            )
        title_slug = request.title.lower().replace(" ", "-")
        image_data, image_type = base64_to_image(request.image)
        file = {
            "file": image_data,
            "media_type": image_type,
            "file_name": title_slug,
        }
        image_url = upload_image(file, "banners")
        if image_url is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Image upload failed, because of cloud storage error",
            )

        name = image_url.split("/")[-1].split(".")[0]
        image = Image(name=name, image_url=image_url)
        try:
            session.add(image)
            session.commit()
            session.refresh(image)
        except Exception as e:
            logger.error(e)
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
            )

        banner.image_id = image.id

    banner.title = request.title
    banner.url_path = request.url_path
    banner.text_position = request.text_position

    try:
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    return DefaultResponse(message="Banner updated successfully")
