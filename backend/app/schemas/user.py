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


class UserPutAddress(BaseModel):
    detail: str

    class Config:
        orm_mode = True


class UserGetBalance(BaseModel):
    id: UUID
    balance: int

    class Config:
        orm_mode = True


class UserPutBalanceRequest(BaseModel):
    balance: int

    class Config:
        orm_mode = True


class UserPutBalance(BaseModel):
    detail: str

    class Config:
        orm_mode = True


class UserDelete(BaseModel):
    id: UUID

    class Config:
        orm_mode = True
