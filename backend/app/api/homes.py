from typing import Any, Generator

from fastapi import HTTPException, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_db
from app.models.banner import Banner
from app.models.category import Category
from app.models.image import Image
from app.schemas.default_model import DefaultResponse
from app.schemas.home import BestSeller, GetBanners, GetBestSeller, GetCategories

router = APIRouter()


@router.get("/banner", response_model=GetBanners, status_code=status.HTTP_200_OK)
def get_banner(
    session: Generator = Depends(get_db),
) -> Any:
    banners = session.execute(
        f"""
            SELECT banners.id, title, CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(image_url, 'image-not-available.webp')) AS image
            FROM only banners
            JOIN images ON banners.image_id = images.id
            """
    ).fetchall()
    if not banners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There are no banners",
        )
    return GetBanners(data=banners)


@router.get("/category", response_model=GetCategories, status_code=status.HTTP_200_OK)
def get_category_with_image(
    session: Generator = Depends(get_db),
) -> Any:
    categories = session.execute(
        f"""
            SELECT categories.id, categories.title, CONCAT('{settings.CLOUD_STORAGE}/',
            COALESCE(image_url, 'image-not-available.webp')) AS image
            FROM only categories
            LEFT JOIN products ON categories.id = products.category_id
            AND products.id = (
                SELECT id FROM products WHERE category_id = categories.id LIMIT 1
            )
            LEFT JOIN product_images ON products.id = product_images.product_id
            AND product_images.id = (
                SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
            )
            LEFT JOIN images ON product_images.image_id = images.id
            """
    ).fetchall()

    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There are no categories",
        )

    return GetCategories(data=categories)


@router.get(
    "/best-seller", response_model=GetBestSeller, status_code=status.HTTP_200_OK
)
def get_best_seller(
    session: Generator = Depends(get_db),
) -> Any:
    best_seller = session.execute(
        f"""
            SELECT products.id, products.title, products.price,
            array_agg(DISTINCT CONCAT('{settings.CLOUD_STORAGE}/',
            COALESCE(images.image_url, 'image-not-available.webp'))) as images
            FROM only products
            LEFT JOIN product_images ON products.id = product_images.product_id
            LEFT JOIN images ON product_images.image_id = images.id
            LEFT JOIN product_size_quantities ON products.id = product_size_quantities.product_id
            JOIN order_items ON product_size_quantities.id = order_items.product_size_quantity_id
            JOIN orders ON order_items.order_id = orders.id
            WHERE orders.status = 'completed'
            GROUP BY products.id
            ORDER BY COUNT(order_items.id) DESC
            LIMIT 10
            """
    ).fetchall()

    if not best_seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There are no best seller items",
        )

    return GetBestSeller(data=best_seller)
