from sqlalchemy import Column, ForeignKey, Integer

from app.db import Base
from app.models.default import DefaultModel


class ProductSizeQuantity(DefaultModel, Base):
    __tablename__ = "product_size_quantities"

    quantity = Column(Integer, nullable=False)
    product_id = Column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    size_id = Column(ForeignKey("sizes.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, product_id, size_id):
        product_size_quantity = ProductSizeQuantity(
            id=fake.uuid4(),
            quantity=fake.pyint(min_value=1000),
            product_id=product_id,
            size_id=size_id,
        )
        return product_size_quantity
