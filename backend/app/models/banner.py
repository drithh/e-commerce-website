from sqlalchemy import Column, ForeignKey, String

from app.core.config import settings
from app.db import Base
from app.models.default import DefaultModel


class Banner(DefaultModel, Base):
    __tablename__ = "banners"

    title = Column(String(length=128), nullable=False, unique=True)
    image_id = Column(ForeignKey("images.id", ondelete="CASCADE"), nullable=False)
    url_path = Column(
        String(length=256),
        nullable=True,
    )
    text_position = Column(String(length=32), nullable=False, server_default="left")

    @classmethod
    def seed(cls, fake, image_id, title, text_position="left"):
        banner = Banner(
            id=fake.uuid4(),
            title=title,
            image_id=image_id,
            text_position=text_position,
        )
        return banner
