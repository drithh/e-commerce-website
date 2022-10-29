from typing import List
from uuid import UUID

from pydantic import BaseModel


class BestSeller(BaseModel):
    id: UUID
    title: str
    images: List[str]


class GetBestSeller(BaseModel):
    data: list[BestSeller]


class Banner(BaseModel):
    id: UUID
    image: str
    title: str

    class Config:
        orm_mode = True


class GetBanners(BaseModel):
    data: list[Banner]

    class Config:
        orm_mode = True


class Category(BaseModel):
    id: UUID
    image: str
    title: str

    class Config:
        orm_mode = True


class GetCategories(BaseModel):
    data: list[Category]

    class Config:
        orm_mode = True
