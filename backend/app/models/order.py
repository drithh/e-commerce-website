from sqlalchemy import Column, ForeignKey, Integer, String

from app.db import Base
from app.models.default import DefaultModel


class Order(DefaultModel, Base):
    __tablename__ = "orders"

    status = Column(String(length=64), nullable=False)
    address = Column(String(length=128), nullable=False)
    city = Column(String(length=64), nullable=False)
    shipping_price = Column(Integer, nullable=False)
    shipping_method = Column(String(length=64), nullable=False)
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, user_id):
        order = Order(
            id=fake.uuid4(),
            status=fake.random_element(
                elements=("pending", "delivered", "cancelled", "finished")
            ),
            address=fake.address(),
            city=fake.city(),
            shipping_price=fake.pyint(min_value=1000),
            shipping_method=fake.random_element(elements=("Next Day", "Standard")),
            user_id=user_id,
        )
        return order
