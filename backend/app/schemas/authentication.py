from typing import Union

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class GetUser(BaseModel):
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
    user_information: GetUser
    message: str
    access_token: str
    token_type: str

    class Config:
        orm_mode = True


class ResetPassword(BaseModel):
    token: str
    password: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str
