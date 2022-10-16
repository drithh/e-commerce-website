from pydantic import BaseModel


class ImageBase(BaseModel):
    name: str
    image_url: str

    class Config:
        orm_mode = True
