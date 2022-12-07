import datetime
from typing import List
from uuid import UUID

from fastapi import Query
from pydantic import BaseModel

from app.schemas.default_model import Pagination


class Sales(BaseModel):
    total_sales: int
    total_user: int
    total_order: int


class GetSales(BaseModel):
    data: Sales


class Customer(BaseModel):
    id: UUID
    name: str
    email: str
    total_order: int
    total_spent: float
    last_order: str

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


class IncomeMonth(BaseModel):
    month: str
    income: int


class CategoryOrder(BaseModel):
    title: str
    total_order: int

    class Config:
        orm_mode = True


class GetDashboard(BaseModel):
    income_per_month: List[IncomeMonth]
    total_order_per_category: List[CategoryOrder]
