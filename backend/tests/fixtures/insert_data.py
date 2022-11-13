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


@pytest.fixture(scope="function")
def create_user(db: Session):
    def inner() -> User:
        user = User.seed(fake, "password")
        db.add(user)
        db.commit()
        db.refresh(user)
        user.password = "password"
        return user

    return inner


@pytest.fixture(scope="function")
def create_admin(db: Session):
    def inner() -> User:
        admin = User.default_admin_seed(fake)
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin

    return inner


@pytest.fixture(scope="function")
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


@pytest.fixture(scope="function")
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


@pytest.fixture(scope="function")
def create_image(db: Session):
    def inner() -> Image:
        image = Image.seed(fake, faker_uuid("image"), faker_uuid("image_url"))
        db.add(image)
        db.commit()
        db.refresh(image)
        return image

    return inner


@pytest.fixture(scope="function")
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


@pytest.fixture(scope="function")
def create_product_image(db: Session, create_product: Callable, create_image: Callable):
    def inner(product=None, image=None) -> ProductImage:
        if not product:
            product = create_product()
        if not image:
            image = create_image()
        product_image = ProductImage.seed(fake, product.id, image.id)
        db.add(product_image)
        db.commit()
        db.refresh(product_image)
        return product_image

    return inner


@pytest.fixture(scope="function")
def create_product_size_quantity(
    db: Session, create_product: Callable, create_size: Callable
):
    def inner(product=None, size=None) -> ProductSizeQuantity:
        if not product:
            product = create_product()
        if not size:
            size = create_size()
        product_size_quantity = ProductSizeQuantity.seed(fake, product.id, size.id)
        db.add(product_size_quantity)
        db.commit()
        db.refresh(product_size_quantity)
        return product_size_quantity

    return inner


@pytest.fixture(scope="function")
def create_size(db: Session):
    def inner() -> Size:
        size = Size.seed(fake, faker_uuid("size"))
        db.add(size)
        db.commit()
        db.refresh(size)
        return size

    return inner


@pytest.fixture(scope="function")
def create_cart(
    db: Session, create_user: Callable, create_product_size_quantity: Callable
):
    def inner(user=None, product_size_quantity=None) -> Cart:
        if not user:
            user = create_user()
        if not product_size_quantity:
            product_size_quantity = create_product_size_quantity()
        cart = Cart.seed(fake, user.id, product_size_quantity.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        return cart

    return inner


@pytest.fixture(scope="function")
def create_wishlist(db: Session, create_user: Callable, create_product: Callable):
    def inner(user=None, product=None) -> Wishlist:
        if not user:
            user = create_user()
        if not product:
            product = create_product()
        wishlist = Wishlist.seed(fake, user.id, product.id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
        return wishlist

    return inner


@pytest.fixture(scope="function")
def create_order(db: Session, create_user: Callable):
    def inner(user=None) -> Order:
        if not user:
            user = create_user()
        order = Order.seed(fake, user.id, "completed")
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    return inner


@pytest.fixture(scope="function")
def create_order_item(
    db: Session, create_order: Callable, create_product_size_quantity: Callable
):
    def inner(order=None, product_size_quantity=None) -> OrderItem:
        if not order:
            order = create_order()
        if not product_size_quantity:
            product_size_quantity = create_product_size_quantity()
        order_item = OrderItem.seed(fake, order.id, product_size_quantity.id)
        db.add(order_item)
        db.commit()
        db.refresh(order_item)
        return order_item

    return inner
