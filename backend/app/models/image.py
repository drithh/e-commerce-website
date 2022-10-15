from sqlalchemy import Column, String
from db import Base
from models.default import DefaultModel


class Image(DefaultModel, Base):
    __tablename__ = "images"

    name = Column(String(length=64), nullable=False, unique=True)
    image_url = Column(String(length=64), nullable=False)
