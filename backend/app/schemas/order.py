import datetime
from typing import List
from uuid import UUID

from fastapi import File, Form, Query, Response, UploadFile, status
from pydantic import BaseModel

from app.schemas.default_model import Pagination


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
    shipping_price: int
    city: str
    status: str
    shipping_address: str


class GetUserOrders(BaseModel):
    data: List[GetUserOrder]
    pagination: Pagination


class GetDetailOrder(GetUserOrder, BaseModel):
    name: str
    email: str


class GetShippingPrice(BaseModel):
    name: str
    price: int


class GetAdminOrder(BaseModel):
    id: UUID
    created_at: str
    users_id: UUID
    user_email: str
    user_name: str
    status: str
    total: int


class GetAdminOrders(BaseModel):
    data: List[GetAdminOrder]


class OrderAddress(BaseModel):
    address_name: str
    address: str
    city: str
    phone_number: str


class CreateOrder(BaseModel):
    shipping_method: str = Query("", regex="^(Next Day|Regular)$")
    shipping_address: OrderAddress
    send_email: bool = Query(False)
