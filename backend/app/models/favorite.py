from sqlalchemy import Column, ForeignKey

from app.db import Base
from app.models.default import DefaultModel


class Favorite(DefaultModel, Base):
    __tablename__ = "favorites"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, user_id, product_id):
        order = Favorite(
            id=fake.uuid4(),
            user_id=user_id,
            product_id=product_id,
        )
        return order
