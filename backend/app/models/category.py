from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from app.db import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(GUID, primary_key=True)
    title = Column(String(length=64), nullable=False, unique=True)
    image_id = Column(ForeignKey("images.id"), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"Image(id={self.id!r}, name={self.title!r})"
