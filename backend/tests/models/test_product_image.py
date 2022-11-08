from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category
from app.models.image import Image
from app.models.product import Product
from app.models.product_image import ProductImage

fake = Faker("id_ID")


def test_product_image_model(db: Session):
    category = Category.seed(
        fake,
        "category_product_image_1",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_image_1",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    image = Image.seed(fake, "image_product_image_1", "https://image.com")
    db.add(image)
    db.commit()

    product_image = ProductImage.seed(fake, product.id, image.id)
    db.add(product_image)
    db.commit()
    assert (
        db.query(ProductImage)
        .join(Product)
        .join(Image)
        .filter(ProductImage.id == product_image.id)
        .first()
    )


def test_foreign_key_product_id(db: Session):
    image = Image.seed(fake, "image_product_image_2", "https://image.com")
    db.add(image)
    db.commit()

    product_image = ProductImage.seed(fake, fake.uuid4(), image.id)
    db.add(product_image)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_image_id(db: Session):
    category = Category.seed(
        fake,
        "category_product_image_3",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_image_3",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    product_image = ProductImage.seed(fake, product.id, fake.uuid4())
    db.add(product_image)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_product_image(db: Session):
    category = Category.seed(
        fake,
        "category_product_image_4",
        "product",
    )
    db.add(category)
    db.commit()

    product = Product.seed(
        fake,
        "product_image_4",
        10000,
        category.id,
    )
    db.add(product)
    db.commit()

    image = Image.seed(fake, "image_product_image_4", "https://image.com")
    db.add(image)
    db.commit()

    product_image = ProductImage.seed(fake, product.id, image.id)
    db.add(product_image)
    db.commit()
    db.delete(product_image)
    db.commit()
    assert not (
        db.query(ProductImage)
        .join(Product)
        .join(Image)
        .filter(ProductImage.id == product_image.id)
        .first()
    )
