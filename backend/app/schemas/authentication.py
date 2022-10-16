from typing import Union

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class User(BaseModel):
    name: str
    email: str
    phone_number: str
    type: str


class UserDefault(BaseModel):
    name: str
    email: str
    phone_number: str
    salt: str
    hashed_password: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone_number: str


class UserRead(BaseModel):
    user_information: User
    token: str
    message: str

    class Config:
        orm_mode = True
