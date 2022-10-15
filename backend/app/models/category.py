from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, ForeignKey, String
from db import Base
from models.default import DefaultModel


class Category(DefaultModel, Base):
    __tablename__ = "categories"

    title = Column(String(length=64), nullable=False, unique=True)
    image_id = Column(ForeignKey("images.id"), nullable=False)
