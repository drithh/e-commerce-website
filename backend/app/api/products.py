from typing import Any, Generator, List, Union
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
from app.schemas.product import CreateProduct, GetProduct, UpdateProduct
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


@router.delete(
    "/{product_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def delete_product(
    product_id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Any:

    product = session.query(Product).filter(Product.id == product_id).first()
    session.delete(product)
    session.commit()

    return DefaultResponse(message="Product deleted")


@router.get("", response_model=Any, status_code=status.HTTP_200_OK)
def get_products(
    session: Generator = Depends(get_db),
    category: List[UUID] = Query(),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1),
    sort_by: str = Query("a_z", regex="^(a_z|z_a)$"),
    price: List[int] = Query([1, 1000000], ge=0),
    condition: str = Query("new", regex="^(new|used)$"),
    product_name: Union[str, None] = Query(None),
) -> Any:

    if sort_by == "a_z":
        sort = Product.price.asc()
    else:
        sort = Product.price.desc()

    if product_name:
        products = (
            session.query(Product)
            .filter(
                Product.title == product_name,
                Product.category_id.in_(category),
                Product.price.in_(range(price[0], price[1])),
                Product.condition == condition,
            )
            .order_by(sort)
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

    else:
        products = (
            session.query(Product)
            .filter(
                Product.category_id.in_(category),
                Product.price.in_(range(price[0], price[1])),
                Product.condition == condition,
            )
            .order_by(sort)
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

    total_rows = len(products)

    return {
        "data": products,
        "total_rows": total_rows,
    }


@router.get("/{id}", response_model=GetProduct, status_code=status.HTTP_200_OK)
def get_product(
    id: UUID,
    session: Generator = Depends(get_db),
) -> Any:

    product_image = (
        session.query(Image)
        .join(ProductImage)
        .filter(ProductImage.product_id == id)
        .all()
    )
    product = session.query(Product).filter(Product.id == id).first()

    images_url = [image.image_url for image in product_image]
    product.images_url = images_url

    return product
