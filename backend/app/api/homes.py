from typing import Any, Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.db import get_db
from app.models.banner import Banner
from app.models.category import Category
from app.models.image import Image
from app.schemas.home import BestSeller, GetBanners, GetBestSeller, GetCategories
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("/banner", response_model=GetBanners, status_code=status.HTTP_200_OK)
def get_banner(
    session: Generator = Depends(get_db),
) -> Any:
    return {
        "data": session.query(Banner.id, Image.image_url.label("image"), Banner.title)
        .join(Image, Banner.image_id == Image.id)
        .all()
    }


@router.get("/category", response_model=GetCategories, status_code=status.HTTP_200_OK)
def get_category_with_image(
    session: Generator = Depends(get_db),
) -> Any:
    return {
        "data": session.query(
            Category.id, Image.image_url.label("image"), Category.title
        )
        .join(Image, Category.image_id == Image.id)
        .all()
    }


@router.get(
    "/best-seller", response_model=GetBestSeller, status_code=status.HTTP_200_OK
)
def get_best_seller(
    session: Generator = Depends(get_db),
) -> Any:

    return GetBestSeller(
        data=session.execute(
            """
            SELECT products.id, products.title, images.image_url, COUNT(order_items.id) as total_sold FROM order_items
            JOIN orders ON order_items.order_id = orders.id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN products ON product_size_quantities.product_id = products.id
            JOIN product_images ON products.id = product_images.product_id
            JOIN images ON product_images.image_id = images.id
            WHERE orders.status = 'finished' AND images.image_url LIKE '%1.webp'
            GROUP BY products.id, images.image_url, products.title
            ORDER BY COUNT(order_items.id) DESC
            LIMIT 8
            """
        ).fetchall()
    )
