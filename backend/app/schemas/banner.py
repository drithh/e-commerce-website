from typing import Optional
from uuid import UUID

from fastapi import Query
from pydantic import BaseModel


class Banner(BaseModel):
    id: UUID
    image: str
    title: str
    url_path: str
    text_position: str

    class Config:
        orm_mode = True


class GetBanners(BaseModel):
    data: list[Banner]

    class Config:
        orm_mode = True


class CreateBanner(BaseModel):
    image: str
    title: str
    url_path: Optional[str] = "products"
    text_position: Optional[str] = Query("left", regex="^(left|right)$")

    class Config:
        orm_mode = True


class UpdateBanner(BaseModel):
    id: UUID
    image: Optional[str]
    title: str
    url_path: str
    text_position: str = Query("left", regex="^(left|right)$")

    class Config:
        orm_mode = True
