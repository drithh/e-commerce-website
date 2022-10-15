from sqlalchemy import Column, ForeignKey, Integer, String

from app.db import Base
from app.models.default import DefaultModel


class Order(DefaultModel, Base):
    __tablename__ = "orders"

    address = Column(String(length=128), nullable=False)
    city = Column(String(length=64), nullable=False)
    shipping_price = Column(Integer, nullable=False)
    user_id = Column(ForeignKey("users.id"), nullable=False)

    @classmethod
    def seed(cls, fake, user_id):
        order = Order(
            id=fake.uuid4(),
            address=fake.address(),
            city=fake.city(),
            shipping_price=fake.pyint(min_value=1000),
            user_id=user_id,
        )
        return order
