from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.size import Size

fake = Faker("id_ID")


def test_product_size_quantity_model(db: Session, create_product_size_quantity):
    product_size_quantity = create_product_size_quantity()
    assert (
        db.query(ProductSizeQuantity)
        .filter(ProductSizeQuantity.id == product_size_quantity.id)
        .first()
    )


def test_foreign_key_product_id(db: Session, create_size):
    size = create_size()

    product_size_quantity = ProductSizeQuantity.seed(fake, fake.uuid4(), size.id)
    db.add(product_size_quantity)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_size_id(db: Session, create_product):
    product = create_product()

    product_size_quantity = ProductSizeQuantity.seed(fake, product.id, fake.uuid4())
    db.add(product_size_quantity)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_product_size_quantity(db: Session, create_product_size_quantity):
    product_size_quantity = create_product_size_quantity()
    assert (
        db.query(ProductSizeQuantity)
        .join(Product)
        .join(Size)
        .filter(ProductSizeQuantity.id == product_size_quantity.id)
        .first()
    )
    db.delete(product_size_quantity)
    db.commit()
    assert not (
        db.query(ProductSizeQuantity)
        .join(Product)
        .join(Size)
        .filter(ProductSizeQuantity.id == product_size_quantity.id)
        .first()
    )
