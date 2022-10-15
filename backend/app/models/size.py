from sqlalchemy import Column, String, Boolean
from db import Base
from models.default import DefaultModel


class Size(DefaultModel, Base):
    __tablename__ = "sizes"

    size = Column(String(length=1), nullable=False)
