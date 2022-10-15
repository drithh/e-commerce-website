from sqlalchemy import Column, String, ForeignKey, Integer
from db import Base
from models.default import DefaultModel


class ProductImages(DefaultModel, Base):
    __tablename__ = "product_images"

    image_id = Column(ForeignKey("images.id"), nullable=False)
    product_id = Column(ForeignKey("products.id"), nullable=False)
