from uuid import UUID

from pydantic import BaseModel


class GetUser(BaseModel):
    id: UUID
    name: str
    email: str
    phone_number: str
    address_name: str
    address: str
    city: str
    balance: int

    class Config:
        orm_mode = True


class GetUserAddress(BaseModel):
    id: UUID
    address_name: str
    phone_number: str
    address: str
    city: str

    class Config:
        orm_mode = True


class GetUserBalance(BaseModel):
    id: UUID
    balance: int

    class Config:
        orm_mode = True


class PutUserBalance(BaseModel):
    balance: int

    class Config:
        orm_mode = True


class DeleteUser(BaseModel):
    id: UUID

    class Config:
        orm_mode = True
