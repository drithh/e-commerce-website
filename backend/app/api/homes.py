from typing import Generator

from fastapi import HTTPException, status
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_db
from app.schemas.home import GetBestSeller, GetCategories

router = APIRouter()


@router.get("/category", response_model=GetCategories, status_code=status.HTTP_200_OK)
def get_category_with_image(
    session: Generator = Depends(get_db),
) -> JSONResponse:
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
) -> JSONResponse:
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
