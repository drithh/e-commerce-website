from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, DateTime, ForeignKey, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True)
    name = Column(String(length=64), nullable=False)
    email = Column(String(length=64), unique=True, index=True, nullable=False)

    hashed_password = Column(String(length=72), nullable=False)
    salt = Column(String(length=64), nullable=False)

    phone_number = Column(String(length=64), nullable=False)
    address = Column(String(length=64), nullable=False)
    city = Column(String(length=64), nullable=False)
    balance = Column(String(length=64), nullable=False)

    is_admin = Column(Boolean, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"User(id={self.id!r}, name={self.email!r})"
