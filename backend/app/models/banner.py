from sqlalchemy import Column, String, ForeignKey
from app.db import Base
from app.models.default import DefaultModel


class Banner(DefaultModel, Base):
    __tablename__ = "banners"

    title = Column(String(length=64), nullable=False)
    image_id = Column(ForeignKey("images.id"), nullable=False)
