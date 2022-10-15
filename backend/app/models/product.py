from sqlalchemy import Column, ForeignKey, Integer, String

from app.db import Base
from app.models.default import DefaultModel


class Product(DefaultModel, Base):
    __tablename__ = "products"

    title = Column(String(length=64), nullable=False)
    brand = Column(String(length=64), nullable=False)
    product_detail = Column(String(length=256), nullable=False)
    price = Column(Integer, nullable=False)
    condition = Column(String(length=64), nullable=False)
    category_id = Column(ForeignKey("categories.id"), nullable=False)

    @classmethod
    def seed(cls, fake, category_id):
        product = Product(
            id=fake.uuid4(),
            title=fake.text(max_nb_chars=16),
            brand=fake.text(max_nb_chars=16),
            product_detail=fake.text(max_nb_chars=120),
            price=fake.pyint(min_value=500),
            condition=fake.random_element(elements=("new", "used")),
            category_id=category_id,
        )
        return product
