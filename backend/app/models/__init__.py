# Import all models here so alembic can discover them
from fastapi_users.db import SQLAlchemyBaseUserTable

from app.db import Base
from app.models.user import User
from app.models.image import Image
from app.models.category import Category
