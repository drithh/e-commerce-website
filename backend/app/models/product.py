from sqlalchemy import Column, ForeignKey, Integer, String

from app.db import Base
from app.models.default import DefaultModel


class Product(DefaultModel, Base):
    __tablename__ = "products"

    title = Column(String(length=64), nullable=False)
    brand = Column(String(length=64), nullable=False)
    product_detail = Column(String(length=128), nullable=False)
    price = Column(Integer, nullable=False)
    condition = Column(String(length=64), nullable=False)
    category_id = Column(ForeignKey("categories.id"), nullable=False)
