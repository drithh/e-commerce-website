from sqlalchemy import Column, ForeignKey, Integer

from app.db import Base
from app.models.default import DefaultModel


class Cart(DefaultModel, Base):
    __tablename__ = "carts"

    quantity = Column(Integer, nullable=False)
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_size_quantity_id = Column(
        ForeignKey("product_size_quantities.id", ondelete="CASCADE"), nullable=False
    )

    @classmethod
    def seed(cls, fake, user_id, product_size_quantity_id):
        cart = Cart(
            id=fake.uuid4(),
            quantity=fake.pyint(min_value=1, max_value=5),
            user_id=user_id,
            product_size_quantity_id=product_size_quantity_id,
        )
        return cart
