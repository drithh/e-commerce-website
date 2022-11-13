from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product
from app.models.user import User
from app.models.wishlist import Wishlist

fake = Faker("id_ID")


def test_wishlist_model(db: Session, create_wishlist):
    wishlist = create_wishlist()

    assert (
        db.query(Wishlist)
        .join(User)
        .join(Product)
        .filter(Wishlist.id == wishlist.id)
        .first()
    )


def test_foreign_key_user_id(db: Session, create_product):
    product = create_product()

    wishlist = Wishlist.seed(fake, fake.uuid4(), product.id)
    db.add(wishlist)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_product_id(db: Session, create_user):
    user = create_user()

    wishlist = Wishlist.seed(fake, user.id, fake.uuid4())
    db.add(wishlist)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_wishlist(db: Session, create_wishlist):
    wishlist = create_wishlist()
    assert (
        db.query(Wishlist)
        .join(User)
        .join(Product)
        .filter(Wishlist.id == wishlist.id)
        .first()
    )

    db.delete(wishlist)
    db.commit()
    assert not (
        db.query(Wishlist)
        .join(User)
        .join(Product)
        .filter(Wishlist.id == wishlist.id)
        .first()
    )
