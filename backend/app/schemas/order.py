import datetime
from typing import List
from uuid import UUID

from fastapi import File, Form, Query, Response, UploadFile, status
from pydantic import BaseModel


class GetUserProductDetails(BaseModel):
    quantity: int
    size: str


class GetUserProducts(BaseModel):
    id: UUID
    details: List[GetUserProductDetails]
    price: int
    image: str
    name: str


class GetUserOrder(BaseModel):
    id: UUID
    created_at: datetime.datetime
    products: List[GetUserProducts]
    shipping_method: str
    status: str
    shipping_address: str


class GetUserOrders(BaseModel):
    data: List[GetUserOrder]


class GetAdminOrder(BaseModel):
    id: UUID
    title: str
    sizes: List[str]
    created_at: datetime.datetime
    product_detail: str
    email: str
    images_url: List[str]
    total: int


class GetAdminOrders(BaseModel):
    data: List[GetAdminOrder]