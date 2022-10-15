from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from app.db import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(GUID, primary_key=True)
    name = Column(String(length=64), nullable=False, unique=True)
    image_url = Column(String(length=64), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"Image(id={self.id!r}, name={self.name!r})"
