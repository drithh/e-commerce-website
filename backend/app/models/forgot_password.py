import bcrypt
from sqlalchemy import Column, DateTime, ForeignKey, String

from app.db import Base
from app.models.default import DefaultModel


class ForgotPassword(DefaultModel, Base):
    __tablename__ = "forgot_passwords"

    token = Column(String(length=128), nullable=False)
    expired_at = Column(DateTime(timezone=True), nullable=False)
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
