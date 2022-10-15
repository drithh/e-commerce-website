from sqlalchemy import Column, ForeignKey, Integer

from app.db import Base
from app.models.default import DefaultModel


class ProductSizeQuantity(DefaultModel, Base):
    __tablename__ = "product_size_quantities"

    quantity = Column(Integer, nullable=False)
    product_id = Column(ForeignKey("products.id"), nullable=False)
    size_id = Column(ForeignKey("sizes.id"), nullable=False)
