from datetime import datetime, timedelta

import bcrypt
import pytz
from sqlalchemy import Column, DateTime, ForeignKey, String

from app.db import Base
from app.models.default import DefaultModel


class ForgotPassword(DefaultModel, Base):
    __tablename__ = "forgot_passwords"

    token = Column(String(length=128), nullable=False)
    expires_in = Column(
        DateTime(timezone=True),
        nullable=False,
        default=pytz.utc.localize(datetime.now() + timedelta(hours=1)),
    )
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
