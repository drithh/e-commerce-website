from typing import List
from uuid import UUID

from pydantic import BaseModel


class DetailCategory(BaseModel):
    id: UUID
    title: str
    type: str

    class Config:
        orm_mode = True


class GetCategory(BaseModel):
    data: List[DetailCategory]

    class Config:
        orm_mode = True


class SetImage(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True


class UpdateCategory(BaseModel):
    title: str
    type: str

    class Config:
        orm_mode = True


class DeleteCategory(BaseModel):
    id: UUID

    class Config:
        orm_mode = True
