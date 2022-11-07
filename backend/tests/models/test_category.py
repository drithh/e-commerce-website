from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product

fake = Faker("id_ID")


def test_category_model(db: Session):
    category = Category.seed(
        fake,
        {
            "title": "category_1",
            "type": "product",
        },
    )
    db.add(category)
    db.commit()
    assert db.query(Category).filter(Category.id == category.id).first()


def test_unique_category_title(db: Session):
    category = Category.seed(
        fake,
        {
            "title": "category_2",
            "type": "product",
        },
    )
    db.add(category)
    db.commit()

    category2 = Category.seed(
        fake,
        {
            "title": "category_2",
            "type": "product",
        },
    )
    db.add(category2)

    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_product_id(db: Session):
    category = Category.seed(
        fake,
        {
            "title": "category_3",
            "type": "product",
        },
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        {
            "name": "product_category_3",
            "price": 10000,
        },
        category.id,
    )
    db.add(product)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_category(db: Session):

    category = Category.seed(
        fake,
        {
            "title": "category_4",
            "type": "product",
        },
    )
    db.add(category)
    db.commit()

    db.delete(category)
    db.commit()
    assert not db.query(Category).filter(Category.id == category.id).first()
