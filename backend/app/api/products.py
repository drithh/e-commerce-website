from typing import Any, Generator
from uuid import UUID

from fastapi import Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.image import Image
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.user import User
from app.schemas.product import CreateProduct, UpdateProduct
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    request: CreateProduct,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:

    product = Product(
        title=request.title,
        brand=request.brand,
        product_detail=request.product_detail,
        price=request.price,
        condition=request.condition,
        category_id=request.category_id,
    )

    session.add(product)
    session.commit()

    for image in request.images:
        image = Image(
            name=image.name,
            image_url=image.image_url,
        )
        session.add(image)
        session.commit()

        product_image = ProductImage(
            product_id=product.id,
            image_id=image.id,
        )

        session.add(product_image)
        session.commit()

    return DefaultResponse(message="Product added")


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_product(
    request: UpdateProduct,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:

    product = session.query(Product).filter(Product.id == request.id).first()

    product.title = request.title
    product.brand = request.brand
    product.product_detail = request.product_detail
    product.price = request.price
    product.condition = request.condition
    product.category_id = request.category_id

    session.commit()

    if request.images:
        for image in request.images:
            updated_image = session.query(Image).filter(Image.id == image.id).first()
            updated_image.name = image.name
            updated_image.image_url = image.image_url
            session.commit()

    return DefaultResponse(message="Product updated")


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:

    product = session.query(Product).filter(Product.id == product_id).first()
    session.delete(product)

    product_image = (
        session.query(ProductImage).filter(ProductImage.product_id == product_id).all()
    )
    for item in product_image:
        deleted_image = session.query(Image).filter(Image.id == item.image_id).first()
        session.delete(deleted_image)
        session.delete(item)

    session.commit()

    return DefaultResponse(message="Product deleted")
