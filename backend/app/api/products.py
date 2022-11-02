import base64
from typing import Any, Generator, List
from uuid import UUID

from fastapi import File, Form, Query, Response, UploadFile, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.db import engine
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.image import Image
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.size import Size
from app.models.user import User
from app.schemas.product import CreateProduct, GetProduct, GetProducts, UpdateProduct
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

    logger.info(f"Product {product.title} created by {current_user.name}")

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

    logger.info(f"Product {product.title} updated by {current_user.name}")

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

    logger.info(f"Product {product.title} deleted by {current_user.name}")

    return DefaultResponse(message="Product deleted")


@router.get("", response_model=GetProducts, status_code=status.HTTP_200_OK)
def get_products(
    session: Generator = Depends(get_db),
    category: List[UUID] = Query([]),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1),
    sort_by: str = Query("a_z", regex="^(a_z|z_a|)$"),
    price: List[int] = Query([], ge=0),
    condition: str = Query("", regex="^(new|used|)$"),
    product_name: str = "",
) -> Any:

    if sort_by == "a_z":
        sort = "ASC"
    else:
        sort = "DESC"

    query = f"""
        SELECT products.id, products.title, products.brand, products.product_detail,
        products.price, products.condition, products.category_id,
        array_agg(CONCAT('{settings.CLOUD_STORAGE}/', images.image_url)) as images
        FROM only products
        LEFT JOIN product_images ON products.id = product_images.product_id
        LEFT JOIN images ON product_images.image_id = images.id
        """
    if category:
        query += "AND category_id IN :category "
    if product_name != "":
        query += "AND title LIKE :product_name "
    if price:
        query += "AND price BETWEEN :price_min AND :price_max "
    if condition != "":
        query += "AND condition = :condition "
    query += f"GROUP BY products.id  ORDER BY title {sort} LIMIT :limit OFFSET :offset"

    query = query.replace("AND", "WHERE", 1)

    products = session.execute(
        query,
        {
            "category": tuple(category),
            "product_name": f"%{product_name}%",
            "price_min": price[0] if price.__len__() > 0 else 0,
            "price_max": price[1] if price.__len__() > 1 else 100000000,
            "condition": condition,
            "offset": (page - 1) * page_size,
            "limit": page_size,
        },
    ).fetchall()
    # get total row count for pagination with psycopg2 cursor get engine
    # total =
    with engine.connect() as conn:
        # get cursor
        cursor = conn.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM products")
        logger.info(cursor.rowcount)

    # import psycopg2
    # from sqlalchemy import create_engine

    # total = cursor.rowcount
    return GetProducts(
        data=products,
        total_rows=len(products),
    )


@router.get("/{id}", status_code=status.HTTP_200_OK)
def get_product(
    id: UUID,
    session: Generator = Depends(get_db),
) -> Any:
    return session.execute(
        f"""
        SELECT products.id, products.title, products.brand, products.product_detail,
        products.price, products.condition, products.category_id,
        array_agg(DISTINCT  CONCAT('{settings.CLOUD_STORAGE}/', images.image_url)) as images,
        array_agg(DISTINCT  sizes.size) as size
        FROM only products
        JOIN product_images ON products.id = product_images.product_id
        JOIN images ON product_images.image_id = images.id
        JOIN product_size_quantities ON products.id = product_size_quantities.product_id
        JOIN sizes ON product_size_quantities.size_id = sizes.id
        WHERE products.id = :id
        GROUP BY products.id
        """,
        {"id": id},
    ).fetchone()


@router.post("/search_image/upload", status_code=status.HTTP_200_OK)
def search_image_upload(
    file: UploadFile = File(...),
    session: Generator = Depends(get_db),
) -> Any:
    if file:
        try:
            contents = file.file.read()
            logger.info(file.filename)
            with open(file.filename, "wb") as f:
                f.write(contents)
            return Response(content=contents, media_type="image/png")
        except Exception:
            return {"message": "There was an error uploading the file"}
        finally:
            file.file.close()
    return {"message": f"Successfully uploaded {file.filename}"}


@router.post("/search_image", status_code=status.HTTP_200_OK)
def search_image(
    filedata: str = Form(...),
    session: Generator = Depends(get_db),
) -> Any:
    filename = "test.png"
    image_as_bytes = str.encode(filedata)  # convert string to bytes
    img_recovered = base64.b64decode(image_as_bytes)
    return Response(content=img_recovered, media_type="image/png")
    # decode base64string
    try:
        with open("uploaded_" + filename, "wb") as f:
            f.write(img_recovered)
    except Exception:
        return {"message": "There was an error uploading the file"}

    return {"message": f"Successfuly uploaded {filename}"}
