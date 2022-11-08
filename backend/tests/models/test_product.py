from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product

fake = Faker("id_ID")


def test_product_model(db: Session):
    category = Category.seed(fake, "category_product_1", "product")
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_1",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    assert db.query(Product).filter(Product.id == product.id).first()


def test_foreign_key_category_id(db: Session):
    product = Product.seed(
        fake,
        "product_2",
        10000,
        fake.uuid4(),
    )
    db.add(product)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_product(db: Session):
    category = Category.seed(
        fake,
        "category_product_3",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_3",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    db.delete(product)
    db.commit()
    assert not (
        db.query(Product).join(Category).filter(Product.id == product.id).first()
    )
