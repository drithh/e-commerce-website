from typing import Union

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class Login(BaseModel):
    email: str
    password: str


class User(BaseModel):
    name: str
    email: str
    phone_number: str
    address: str
    city: str
    balance: int
    type: str

    class Config:
        orm_mode = True
