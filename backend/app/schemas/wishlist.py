from typing import List
from uuid import UUID

from pydantic import BaseModel


class GetProduct(BaseModel):
    id: UUID
    title: str
    price: int
    image: str

    class Config:
        orm_mode = True


class GetWishlist(BaseModel):
    data: List[GetProduct]

    class Config:
        orm_mode = True
