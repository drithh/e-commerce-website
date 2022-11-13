from pydantic import BaseModel


class GetImage(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True


class SearchImage(BaseModel):
    image: str

    class Config:
        orm_mode = True
