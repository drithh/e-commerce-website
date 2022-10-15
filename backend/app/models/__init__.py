# Import all models here so alembic can discover them
from fastapi_users.db import SQLAlchemyBaseUserTable

from app.db import Base
from app.models import (
    user,
    banner,
    category,
    image,
    product,
    size,
    cart,
    product_size_quantity,
    order,
    order_item,
    product_image,
)
