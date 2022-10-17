from sqlalchemy import Column, ForeignKey

from app.db import Base
from app.models.default import DefaultModel


class ProductImage(DefaultModel, Base):
    __tablename__ = "product_images"

    image_id = Column(ForeignKey("images.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, product_id, image_id):
        product_image = ProductImage(
            id=fake.uuid4(),
            image_id=image_id,
            product_id=product_id,
        )
        return product_image
