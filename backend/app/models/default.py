from sqlalchemy.orm import declarative_mixin
from typing import TYPE_CHECKING
import datetime
from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, DateTime
from sqlalchemy.sql.functions import func


@declarative_mixin
class DefaultModel:
    """Default Column names for all models."""

    if TYPE_CHECKING:
        id: int
        created_at: datetime
        updated_at: datetime
        deleted_at: datetime

    else:
        id = Column(GUID, primary_key=True)
        created_at = Column(
            DateTime(timezone=True), server_default=func.now(), nullable=True
        )
        updated_at = Column(
            DateTime(timezone=True), server_default=func.now(), nullable=True
        )
        deleted_at = Column(DateTime(timezone=True), nullable=True)
