from typing import Any, Generator

from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
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
    return GetBanners(
        data=session.execute(
            f"""
            SELECT banners.id, title, CONCAT('{settings.CLOUD_STORAGE}/', image_url) AS image
            FROM only banners
            JOIN images ON banners.image_id = images.id
            """
        ).fetchall()
    )


@router.get("/category", response_model=GetCategories, status_code=status.HTTP_200_OK)
def get_category_with_image(
    session: Generator = Depends(get_db),
) -> Any:
    return GetCategories(
        data=session.execute(
            f"""
            SELECT categories.id, categories.title, CONCAT('{settings.CLOUD_STORAGE}/', image_url) AS image
            FROM only categories
            JOIN products ON categories.id = products.category_id
            AND products.id = (
                SELECT id FROM products WHERE category_id = categories.id LIMIT 1
            )
            JOIN product_images ON products.id = product_images.product_id
            AND product_images.id = (
                SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
            )
            JOIN images ON product_images.image_id = images.id
            """
        ).fetchall()
    )


@router.get(
    "/best-seller", response_model=GetBestSeller, status_code=status.HTTP_200_OK
)
def get_best_seller(
    session: Generator = Depends(get_db),
) -> Any:
    return GetBestSeller(
        data=session.execute(
            f"""
            SELECT products.id, products.title, products.price,
            array_agg(DISTINCT CONCAT('{settings.CLOUD_STORAGE}/', images.image_url)) as images
            FROM only products
            JOIN product_images ON products.id = product_images.product_id
            JOIN images ON product_images.image_id = images.id
            JOIN product_size_quantities ON products.id = product_size_quantities.product_id
            JOIN order_items ON product_size_quantities.id = order_items.product_size_quantity_id
            JOIN orders ON order_items.order_id = orders.id
            WHERE orders.status = 'finished'
            GROUP BY products.id
            ORDER BY COUNT(order_items.id) DESC
            """
        ).fetchall()
    )
