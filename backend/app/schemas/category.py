from typing import List
from uuid import UUID

from pydantic import BaseModel


class Category(BaseModel):
    id: UUID
    image: str
    title: str

    class Config:
        orm_mode = True


class GetCategory(BaseModel):
    data: List[Category]

    class Config:
        orm_mode = True


class SetImage(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True


class UpdateCategory(BaseModel):
    id: UUID

    class Config:
        orm_mode = True


class DeleteCategory(BaseModel):
    id: UUID

    class Config:
        orm_mode = True
