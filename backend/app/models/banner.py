from sqlalchemy import Column, ForeignKey, String

from app.db import Base
from app.models.default import DefaultModel


class Banner(DefaultModel, Base):
    __tablename__ = "banners"

    title = Column(String(length=128), nullable=False)
    image_id = Column(ForeignKey("images.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, image_id):
        banner = Banner(
            id=fake.uuid4(),
            title=fake.text(max_nb_chars=80),
            image_id=image_id,
        )
        return banner
