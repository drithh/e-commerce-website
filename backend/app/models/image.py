from sqlalchemy import Column, String

from app.db import Base
from app.models.default import DefaultModel


class Image(DefaultModel, Base):
    __tablename__ = "images"

    name = Column(String(length=64), nullable=False, unique=True)
    image_url = Column(String(length=64), nullable=False)

    @classmethod
    def seed(cls, fake, name):
        url = f"https://test.com/{name}.jpg"
        image = Image(
            id=fake.uuid4(),
            name=name,
            image_url=url,
        )
        return image
