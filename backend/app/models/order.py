from sqlalchemy import Column, String, ForeignKey, Integer
from db import Base
from models.default import DefaultModel


class Order(DefaultModel, Base):
    __tablename__ = "orders"

    address = Column(String(length=64), nullable=False)
    city = Column(String(length=64), nullable=False)
    shipping_price = Column(Integer, nullable=False)
    user_id = Column(ForeignKey("users.id"), nullable=False)
