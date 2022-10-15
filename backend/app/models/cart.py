from sqlalchemy import Column, String, ForeignKey, Integer
from app.db import Base
from app.models.default import DefaultModel


class Cart(DefaultModel, Base):
    __tablename__ = "carts"

    quantity = Column(Integer, nullable=False)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    product_size_quantity_id = Column(
        ForeignKey("product_size_quantities.id"), nullable=False
    )
