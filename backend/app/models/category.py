from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, String

from app.db import Base
from app.models.default import DefaultModel


class Category(DefaultModel, Base):
    __tablename__ = "categories"

    title = Column(String(length=64), nullable=False, unique=True)
    type = Column(String(length=64), nullable=False, default="Other")

    @classmethod
    def seed(cls, fake, category_title, category_type):
        category = Category(
            id=fake.uuid4(),
            title=category_title,
            type=category_type,
        )
        return category
