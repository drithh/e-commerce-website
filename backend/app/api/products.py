import math
from typing import Generator, List
from uuid import UUID

from fastapi import File, HTTPException, Query, Response, UploadFile, status
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.deps.google_cloud import upload_image
from app.deps.image_base64 import base64_to_image
from app.deps.sql_error import format_error
from app.models.image import Image
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.size import Size
from app.models.user import User
from app.schemas.default_model import DefaultResponse
from app.schemas.product import (
    CreateProduct,
    GetProduct,
    GetProducts,
    Pagination,
    UpdateProduct,
)

router = APIRouter()


@router.get("", response_model=GetProducts, status_code=status.HTTP_200_OK)
def get_products(
    session: Generator = Depends(get_db),
    category: List[UUID] = Query([]),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    sort_by: str = Query(
        "Title a_z", regex="^(Title a_z|Title z_a|Price a_z|Price z_a|Newest|Oldest|)$"
    ),
    price: List[int] = Query([], ge=0),
    condition: str = Query("", regex="^(new|used|)$"),
    product_name: str = "",
) -> JSONResponse:
    sorts = sort_by.split(" ")
    if sorts[0] == "Newest":
        order = "products.created_at"
        sort = "DESC"
    elif sorts[0] == "Oldest":
        order = "products.created_at"
        sort = "ASC"
    elif sorts.__len__() == 2:
        order = sorts[0].lower()
        sort = "ASC" if sorts[1] == "a_z" else "DESC"

    query = f"""
        SELECT products.id, products.title, products.brand, products.product_detail,
        products.price, products.condition, products.category_id,
        array_agg(CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))) as images,
        COUNT(*) OVER() totalrow_count
        FROM only products
        LEFT JOIN only product_images ON products.id = product_images.product_id
        LEFT JOIN images ON product_images.image_id = images.id
        """
    if category:
        query += "AND category_id IN :category "
    if product_name != "":
        query += "AND title LIKE :product_name "
    if price.__len__() > 0:
        query += "AND price >= :min_price "
    if price.__len__() > 1:
        query += "AND price <= :max_price "
    if condition != "":
        query += "AND condition = :condition "
    query += "GROUP BY products.id "
    if sort_by != "":
        query += f"ORDER BY {order} {sort} "
    query += "LIMIT :limit OFFSET :offset "

    query = query.replace("AND", "WHERE", 1)

    products = session.execute(
        query,
        {
            "category": tuple(category),
            "product_name": f"%{product_name}%",
            "min_price": price[0] if price.__len__() > 0 else 0,
            "max_price": price[1] if price.__len__() > 1 else 0,
            "condition": condition,
            "limit": page_size,
            "offset": (page - 1) * page_size,
        },
    ).fetchall()

    if products.__len__() == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="There are no products"
        )

    return GetProducts(
        data=products,
        total_rows=len(products),
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_item=products[0].totalrow_count if products else 0,
            total_page=math.ceil(products[0].totalrow_count / page_size)
            if products
            else 1,
        ),
    )


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    request: CreateProduct,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:

    product = Product(
        title=request.title,
        brand=request.brand,
        product_detail=request.product_detail,
        price=request.price,
        condition=request.condition,
        category_id=request.category_id,
    )
    try:
        session.add(product)
        session.commit()
        session.refresh(product)
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    category = session.execute(
        "SELECT title FROM categories WHERE id = :id",
        {"id": request.category_id},
    ).fetchone()[0]

    title_slug = product.title.lower().replace(" ", "-")
    # create product size quantity
    for item in request.stock:
        size_id = session.execute(
            "SELECT id FROM sizes WHERE size = :size",
            {"size": item.size},
        ).fetchone()
        if size_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Size does not exist",
            )
        size_id = size_id[0]
        try:
            product_size_quantity = ProductSizeQuantity(
                product_id=product.id,
                size_id=size_id,
                quantity=item.quantity,
            )
            session.add(product_size_quantity)
            session.commit()
            session.refresh(product_size_quantity)
            logger.info(
                f"Product size quantity {product_size_quantity.id} created by {current_user.name}"
            )
        except Exception as e:
            logger.error(e)
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
            )
    for image in request.images:
        if not image.startswith("data:image"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format. Please use base64 format with data:image",
            )

    for image in request.images:
        image_data, image_type = base64_to_image(image)
        file = {
            "file": image_data,
            "media_type": image_type,
            "file_name": title_slug,
        }
        image_url = upload_image(file, f"products/{category}")
        if image_url is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Product created but image upload failed, because of cloud storage error",
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

        product_image = ProductImage(
            product_id=product.id,
            image_id=image.id,
        )
        try:
            session.add(product_image)
            session.commit()
            session.refresh(product_image)
            logger.info(
                f"Product image {product_image.id} created by {current_user.name}"
            )
        except Exception as e:
            logger.error(e)
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
            )

    logger.info(f"Product {product.title} created by {current_user.name}")

    return DefaultResponse(message="Product added")


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_product(
    request: UpdateProduct,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    try:
        product = session.query(Product).filter(Product.id == request.id).first()

        product.title = request.title
        product.brand = request.brand
        product.product_detail = request.product_detail
        product.price = request.price
        product.condition = request.condition
        product.category_id = request.category_id

        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    # update quantity of each size

    for stock in request.stock:
        size_id = session.execute(
            "SELECT id FROM sizes WHERE size = :size",
            {"size": stock.size},
        ).fetchone()
        if size_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Size does not exist",
            )
        size_id = size_id[0]
        session.execute(
            """
            UPDATE product_size_quantities SET quantity = :quantity WHERE product_id = :product_id
            AND size_id = :size_id
            """,
            {
                "quantity": stock.quantity,
                "product_id": request.id,
                "size_id": size_id,
            },
        )
    session.commit()

    # updating images
    # get all images of the product
    request_updated_images = []
    database_images = session.execute(
        f"""
        SELECT CONCAT('{settings.CLOUD_STORAGE}/', images.image_url) AS image_url, images.id
        FROM only product_images
        JOIN only images ON product_images.image_id = images.id
        WHERE product_images.product_id = :product_id
        """,
        {"product_id": request.id},
    ).fetchall()

    # if images is url do not delete

    for image in request.images:
        if not image.startswith("data:image"):
            request_updated_images.append(image)
        else:
            image_data, image_type = base64_to_image(image)
            file = {
                "file": image_data,
                "media_type": image_type,
                "file_name": request.title.lower().replace(" ", "-"),
            }
            category = session.execute(
                "SELECT title FROM categories WHERE id = :id",
                {"id": request.category_id},
            ).fetchone()[0]

            image_url = upload_image(file, f"products/{category}")
            if image_url is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Product updated but image upload failed, because of cloud storage error",
                )
            name = image_url.split("/")[-1].split(".")[0]
            image = Image(name=name, image_url=image_url)
            try:
                session.add(image)
                session.commit()
                session.refresh(image)
                logger.info(
                    f"Image {image.name} added to product {request.title} by {current_user.name}"
                )
            except Exception as e:
                logger.error(e)
                session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
                )

            try:
                product_image = ProductImage(
                    product_id=request.id,
                    image_id=image.id,
                )
                session.add(product_image)
                session.commit()
                session.refresh(product_image)
                logger.info(
                    f"Product Image Relation {product_image.id} added to product {request.title} by {current_user.name}"
                )

            except Exception as e:
                logger.error(e)
                session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
                )

    # delete images that are not in the request
    for database_image in database_images:
        if database_image.image_url not in request_updated_images:
            session.execute(
                """
                DELETE FROM product_images WHERE product_id = :product_id AND image_id = :image_id
                """,
                {"product_id": request.id, "image_id": database_image.id},
            )
            session.commit()


            logger.info(
                f"Image {database_image.image_url} deleted by {current_user.name}"
            )

    logger.info(f"Product {product.title} updated by {current_user.name}")

    return DefaultResponse(message="Product updated")


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_product(
    product_id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    product = session.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    session.delete(product)
    session.commit()

    logger.info(f"Product {product.title} deleted by {current_user.name}")

    return DefaultResponse(message="Product deleted")


@router.get("/{id}", response_model=GetProduct, status_code=status.HTTP_200_OK)
def get_product(
    id: UUID,
    session: Generator = Depends(get_db),
) -> JSONResponse:
    result = session.execute(
        f"""
        SELECT products.id, products.title, products.brand, products.product_detail,
        products.price, products.condition, products.category_id,
        array_agg(DISTINCT  CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))) as images,
        array_agg(DISTINCT  sizes.size) FILTER (WHERE sizes.size IS NOT NULL) as size, categories.title as category_name,
        array_agg(DISTINCT jsonb_build_object('size', sizes.size, 'quantity', product_size_quantities.quantity))
        FILTER (WHERE sizes.size IS NOT NULL) as stock
        FROM only products
        LEFT JOIN only product_images ON products.id = product_images.product_id
        LEFT JOIN only images ON product_images.image_id = images.id
        LEFT JOIN product_size_quantities ON products.id = product_size_quantities.product_id
        LEFT JOIN sizes ON product_size_quantities.size_id = sizes.id
        JOIN categories ON products.category_id = categories.id
        WHERE products.id = :id
        GROUP BY products.id, categories.title
        """,
        {"id": id},
    ).fetchone()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return result
