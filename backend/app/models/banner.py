from sqlalchemy import Column, ForeignKey, String

from app.db import Base
from app.models.default import DefaultModel


class Banner(DefaultModel, Base):
    __tablename__ = "banners"

    title = Column(String(length=128), nullable=False)
    image_id = Column(ForeignKey("images.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, image_id, text):
        banner = Banner(
            id=fake.uuid4(),
            title=text,
            image_id=image_id,
        )
        return banner
