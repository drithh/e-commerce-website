from typing import Callable

import pytest
from faker import Faker
from sqlalchemy.orm.session import Session

from app.models.banner import Banner
from app.models.cart import Cart
from app.models.category import Category
from app.models.image import Image
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.size import Size
from app.models.user import User
from app.models.wishlist import Wishlist

fake = Faker("id_ID")


def faker_uuid(str: str) -> str:
    return f"{str}_{fake.uuid4()}"


@pytest.fixture(scope="session")
def create_user(db: Session):
    def inner() -> User:
        user = User.default_user_seed(fake)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    return inner


@pytest.fixture(scope="session")
def create_admin(db: Session):
    def inner() -> User:
        admin = User.default_admin_seed(fake)
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin

    return inner


@pytest.fixture(scope="session")
def create_banner(db: Session):
    def inner() -> Banner:
        image = Image.seed(fake, faker_uuid("image"), faker_uuid("image_url"))
        db.add(image)
        db.commit()
        banner = Banner.seed(fake, image.id, faker_uuid("banner"))
        db.add(banner)
        db.commit()
        db.refresh(banner)
        return banner

    return inner


@pytest.fixture(scope="session")
def create_category(db: Session):
    def inner() -> Category:
        category = Category.seed(
            fake, faker_uuid("category_title"), faker_uuid("category_type")
        )
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    return inner


@pytest.fixture(scope="session")
def create_image(db: Session):
    def inner() -> Image:
        image = Image.seed(fake, faker_uuid("image"), faker_uuid("image_url"))
        db.add(image)
        db.commit()
        db.refresh(image)
        return image

    return inner


@pytest.fixture(scope="session")
def create_product(db: Session, create_category: Callable):
    def inner() -> Product:
        category = create_category()
        product = Product.seed(
            fake,
            faker_uuid("product_title"),
            10000,
            category.id,
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    return inner
