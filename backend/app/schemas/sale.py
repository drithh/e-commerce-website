from pydantic import BaseModel


class Sales(BaseModel):
    total: int


class GetSales(BaseModel):
    data: Sales
