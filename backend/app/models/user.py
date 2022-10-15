from sqlalchemy import Column, String, Boolean
from app.db import Base
from app.models.default import DefaultModel


class User(DefaultModel, Base):
    __tablename__ = "users"

    name = Column(String(length=64), nullable=False)
    email = Column(String(length=64), unique=True, index=True, nullable=False)

    hashed_password = Column(String(length=72), nullable=False)
    salt = Column(String(length=64), nullable=False)

    phone_number = Column(String(length=64), nullable=False)
    address = Column(String(length=64), nullable=False)
    city = Column(String(length=64), nullable=False)
    balance = Column(String(length=64), nullable=False)

    is_admin = Column(Boolean, nullable=False)
