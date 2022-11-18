from sqlalchemy import Column, DateTime, ForeignKey, String, text

from app.db import Base
from app.models.default import DefaultModel


class ForgotPassword(DefaultModel, Base):
    __tablename__ = "forgot_passwords"

    token = Column(String(length=16), nullable=False)
    expires_in = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now() + interval '15 minutes'"),
    )
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
