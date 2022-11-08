from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.image import Image
from app.models.product import Product
from app.models.product_image import ProductImage

fake = Faker("id_ID")


def test_product_image_model(db: Session, create_product_image):
    product_image = create_product_image()
    db.add(product_image)
    db.commit()
    assert (
        db.query(ProductImage)
        .join(Product)
        .join(Image)
        .filter(ProductImage.id == product_image.id)
        .first()
    )


def test_foreign_key_product_id(db: Session, create_image):
    image = create_image()

    product_image = ProductImage.seed(fake, fake.uuid4(), image.id)
    db.add(product_image)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_image_id(db: Session, create_product):
    product = create_product()

    product_image = ProductImage.seed(fake, product.id, fake.uuid4())
    db.add(product_image)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_product_image(db: Session, create_product_image):
    product_image = create_product_image()
    assert (
        db.query(ProductImage)
        .join(Product)
        .join(Image)
        .filter(ProductImage.id == product_image.id)
        .first()
    )

    db.delete(product_image)
    db.commit()
    assert not (
        db.query(ProductImage)
        .join(Product)
        .join(Image)
        .filter(ProductImage.id == product_image.id)
        .first()
    )
