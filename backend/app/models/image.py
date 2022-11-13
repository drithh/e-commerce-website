from sqlalchemy import Column, Index, String

from app.db import Base
from app.models.default import DefaultModel


class Image(DefaultModel, Base):
    __tablename__ = "images"

    name = Column(String(length=128), nullable=False, unique=True)
    image_url = Column(String(length=128), nullable=False, unique=True)

    __table_args__ = (Index("image_url", image_url), {"extend_existing": True})

    @classmethod
    def seed(cls, fake, name, url):
        image = Image(
            id=fake.uuid4(),
            name=name,
            image_url=url,
        )
        return image
