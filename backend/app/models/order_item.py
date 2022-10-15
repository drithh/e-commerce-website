from sqlalchemy import Column, String, ForeignKey, Integer
from app.db import Base
from app.models.default import DefaultModel


class OrderItems(DefaultModel, Base):
    __tablename__ = "order_items"

    quantity = Column(Integer, nullable=False)
    order_id = Column(ForeignKey("orders.id"), nullable=False)
    product_size_quantity_id = Column(
        ForeignKey("product_size_quantities.id"), nullable=False
    )
