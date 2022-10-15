from sqlalchemy import Column, String, Boolean
from app.db import Base
from app.models.default import DefaultModel


class Size(DefaultModel, Base):
    __tablename__ = "sizes"

    size = Column(String(length=1), nullable=False)
