from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.models.category import Category


class CreateProduct(BaseModel):
    title: str
    brand: str
    product_detail: str
    images: List[str]
    price: int
    category_id: UUID
    condition: str

    class Config:
        orm_mode = True


class UpdateImage(BaseModel):
    id: UUID
    name: str
    image_url: str

    class Config:
        orm_mode = True


class UpdateProduct(BaseModel):
    id: UUID
    title: str
    brand: str
    product_detail: str
    images: List[UpdateImage]
    price: int
    category_id: UUID
    condition: str

    class Config:
        orm_mode = True


class Stock(BaseModel):
    size: str
    quantity: int

    class Config:
        orm_mode = True


class GetProduct(BaseModel):
    id: UUID
    title: str
    brand: str
    product_detail: str
    images: List[str]
    price: int
    category_id: UUID
    category_name: str
    condition: str
    size: List[str]
    stock: List[Stock]

    class Config:
        orm_mode = True


class Product(BaseModel):
    id: UUID
    title: str
    brand: str
    product_detail: str
    price: int
    category_id: UUID
    condition: str
    images: List[str]

    class Config:
        orm_mode = True


class Pagination(BaseModel):
    page: int
    page_size: int
    total_page: int
    total_item: int


class GetProducts(BaseModel):
    data: List[Product]
    total_rows: int
    pagination: Pagination

    class Config:
        orm_mode = True


class SearchImageRequest(BaseModel):
    image: str

    class Config:
        orm_mode = True
