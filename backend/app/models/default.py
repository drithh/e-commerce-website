from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import Column, DateTime
from sqlalchemy.orm import declarative_mixin
from sqlalchemy.sql.functions import func


@declarative_mixin
class DefaultModel:
    """Default Column names for all models."""

    id = Column(GUID, primary_key=True, server_default=func.uuid_generate_v4())
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=True,
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)
