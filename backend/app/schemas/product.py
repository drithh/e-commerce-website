from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.models.category import Category


class CreateImage(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True


class CreateProduct(BaseModel):
    title: str
    brand: str
    product_detail: str
    images: List[CreateImage]
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


class GetProduct(BaseModel):
    id: UUID
    title: str
    brand: str
    product_detail: str
    images_url: List[str]
    price: int
    category_id: UUID
    condition: str
    size: list

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

    class Config:
        orm_mode = True


class GetProducts(BaseModel):
    data: List[Product]
    total_rows: int

    class Config:
        orm_mode = True
