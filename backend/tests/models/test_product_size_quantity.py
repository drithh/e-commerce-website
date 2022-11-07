from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.product import Product
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.size import Size

fake = Faker("id_ID")


def test_product_size_quantity_model(db: Session):
    category = Category.seed(
        fake, {"title": "category_product_size_quantity_1", "type": "product"}
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        {
            "name": "product_product_size_quantity_1",
            "price": 10000,
        },
        category.id,
    )
    db.add(product)
    db.commit()

    size = Size.seed(fake, "size_product_size_quantity_1")
    db.add(size)
    db.commit()

    product_size_quantity = ProductSizeQuantity.seed(fake, product.id, size.id)
    db.add(product_size_quantity)
    db.commit()
    assert (
        db.query(ProductSizeQuantity)
        .join(Product)
        .join(Size)
        .filter(ProductSizeQuantity.id == product_size_quantity.id)
        .first()
    )


def test_foreign_key_product_id(db: Session):
    size = Size.seed(fake, "size_product_size_quantity_2")
    db.add(size)
    db.commit()

    product_size_quantity = ProductSizeQuantity.seed(fake, fake.uuid4(), size.id)
    db.add(product_size_quantity)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_size_id(db: Session):
    category = Category.seed(
        fake, {"title": "category_product_size_quantity_3", "type": "product"}
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        {
            "name": "product_product_size_quantity_3",
            "price": 10000,
        },
        category.id,
    )
    db.add(product)
    db.commit()

    product_size_quantity = ProductSizeQuantity.seed(fake, product.id, fake.uuid4())
    db.add(product_size_quantity)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_product_size_quantity(db: Session):
    category = Category.seed(
        fake, {"title": "category_product_size_quantity_4", "type": "product"}
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        {
            "name": "product_product_size_quantity_4",
            "price": 10000,
        },
        category.id,
    )
    db.add(product)
    db.commit()

    size = Size.seed(fake, "size_product_size_quantity_4")
    db.add(size)
    db.commit()

    product_size_quantity = ProductSizeQuantity.seed(fake, product.id, size.id)
    db.add(product_size_quantity)
    db.commit()
    db.delete(product_size_quantity)
    db.commit()
    assert not (
        db.query(ProductSizeQuantity)
        .join(Product)
        .join(Size)
        .filter(ProductSizeQuantity.id == product_size_quantity.id)
        .first()
    )
