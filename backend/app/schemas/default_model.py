from pydantic.main import BaseModel


class Pagination(BaseModel):
    page: int
    page_size: int
    total_page: int
    total_item: int


class DefaultResponse(BaseModel):
    message: str

    class Config:
        orm_mode = True
