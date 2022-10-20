from typing import Dict

from pydantic import BaseModel


class GetSales(BaseModel):
    data: Dict[str, int]
