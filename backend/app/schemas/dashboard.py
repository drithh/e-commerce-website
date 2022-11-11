import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.schemas.request_params import Pagination


class Customer(BaseModel):
    id: UUID
    name: str
    email: str
    total_order: int
    total_spent: float
    last_order: datetime.date

    class Config:
        orm_mode = True


class GetCustomers(BaseModel):
    data: List[Customer]
    pagination: Pagination

    class Config:
        orm_mode = True


class Order(BaseModel):
    id: UUID
    created_at: datetime.date
    name: str
    address: str
    status: str
    total_product: int
    total_price: float

    class Config:
        orm_mode = True


class GetOrders(BaseModel):
    data: List[Order]
    pagination: Pagination

    class Config:
        orm_mode = True
