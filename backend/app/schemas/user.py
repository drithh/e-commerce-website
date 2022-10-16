from uuid import UUID

from pydantic import BaseModel


class UserGet(BaseModel):
    id: UUID
    name: str
    email: str
    phone_number: str
    name_address: str
    address: str
    city: str
    balance: int

    class Config:
        orm_mode = True


class UserGetAddress(BaseModel):
    id: UUID
    address_name: str
    phone_number: str
    address: str
    city: str

    class Config:
        orm_mode = True


class UserPostAddress(BaseModel):
    address_name: str
    phone_number: str
    address: str
    city: str

    class Config:
        orm_mode = True
