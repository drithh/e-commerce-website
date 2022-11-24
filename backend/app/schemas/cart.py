from typing import List
from uuid import UUID

from pydantic import BaseModel


class GetProductDetail(BaseModel):
    quantity: int
    size: str


class GetProduct(BaseModel):
    id: UUID
    details: GetProductDetail
    price: int
    image: str
    name: str
    product_id: UUID

    class Config:
        orm_mode = True


class GetCart(BaseModel):
    data: List[GetProduct]

    class Config:
        orm_mode = True


class CreateCart(BaseModel):
    product_id: UUID
    quantity: int
    size: str

    class Config:
        orm_mode = True


class UpdateCart(BaseModel):
    id: UUID
    quantity: int

    class Config:
        orm_mode = True
