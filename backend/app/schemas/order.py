import datetime
from typing import List
from uuid import UUID

from fastapi import File, Form, Query, Response, UploadFile, status
from pydantic import BaseModel


class RequestOrders(BaseModel):
    sort_by: str = Query("Price a_z", regex="^(Price a_z|Price z_a)$")
    page: int = Query(1, ge=1)
    page_size: int = Query(25, ge=1, le=100)


class GetUserProductDetails(BaseModel):
    quantity: int
    size: str


class GetUserProducts(BaseModel):
    id: UUID
    details: List[GetUserProductDetails]
    price: int
    # image : str
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
