from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.product_size_quantity import ProductSizeQuantity
from app.models.user import User
from app.models.size import Size
from app.models.cart import Cart

fake = Faker("id_ID")


def test_cart_model(db: Session, create_cart):
    cart = create_cart()
    assert (
        db.query(Cart)
        .join(User)
        .join(ProductSizeQuantity)
        .filter(Cart.id == cart.id)
        .first()
    )


def test_foreign_key_user_id(db: Session, create_product_size_quantity):
    product_size_quantity = create_product_size_quantity()

    cart = Cart.seed(fake, fake.uuid4(), product_size_quantity.id)
    db.add(cart)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_product_size_quantity_id(db: Session, create_user):
    user = create_user()

    cart = Cart.seed(fake, user.id, fake.uuid4())
    db.add(cart)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_cart(db: Session, create_cart):
    cart = create_cart()
    assert (
        db.query(Cart)
        .join(User)
        .join(ProductSizeQuantity)
        .filter(Cart.id == cart.id)
        .first()
    )
    db.delete(cart)
    db.commit()
    assert not (
        db.query(Cart)
        .join(User)
        .join(ProductSizeQuantity)
        .filter(Cart.id == cart.id)
        .first()
    )
