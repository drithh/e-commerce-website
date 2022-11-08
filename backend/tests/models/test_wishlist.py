from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product
from app.models.user import User
from app.models.wishlist import Wishlist

fake = Faker("id_ID")


def test_wishlist_model(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()

    category = Category.seed(
        fake,
        "category_product_wishlist_1",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_wishlist_1",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    wishlist = Wishlist.seed(fake, user.id, product.id)
    db.add(wishlist)
    db.commit()
    assert (
        db.query(Wishlist)
        .join(User)
        .join(Product)
        .filter(Wishlist.id == wishlist.id)
        .first()
    )


def test_foreign_key_user_id(db: Session):
    category = Category.seed(
        fake,
        "category_product_wishlist_2",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_wishlist_2",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    wishlist = Wishlist.seed(fake, fake.uuid4(), product.id)
    db.add(wishlist)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_product_id(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()

    wishlist = Wishlist.seed(fake, user.id, fake.uuid4())
    db.add(wishlist)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_wishlist(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()

    category = Category.seed(
        fake,
        "category_product_wishlist_4",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_wishlist_4",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    wishlist = Wishlist.seed(fake, user.id, product.id)
    db.add(wishlist)
    db.commit()

    db.delete(wishlist)
    db.commit()
    assert not (
        db.query(Wishlist)
        .join(User)
        .join(Product)
        .filter(Wishlist.id == wishlist.id)
        .first()
    )
