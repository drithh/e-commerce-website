from typing import List
from uuid import UUID

from pydantic import BaseModel


class GetImage(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True


class SearchImage(BaseModel):
    base64_image: str

    class Config:
        orm_mode = True


class SearchImageResponse(BaseModel):
    id: UUID
    title: str

    class Config:
        orm_mode = True


class SearchText(BaseModel):
    id: UUID
    title: str

    class Config:
        orm_mode = True


class ShowerThoughts(BaseModel):
    data: List[str]

    class Config:
        orm_mode = True
