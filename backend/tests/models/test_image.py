from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.image import Image

fake = Faker("id_ID")


def test_image_model(db: Session, create_image):
    image = create_image()
    assert db.query(Image).filter(Image.id == image.id).first()


def test_unique_image_name(db: Session):
    image = Image.seed(fake, "image_2", "image_url_2")
    db.add(image)
    db.commit()
    image2 = Image.seed(fake, "image_2", "image_url_2")
    db.add(image2)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_image(db: Session, create_image):
    image = create_image()
    assert db.query(Image).filter(Image.id == image.id).first()
    db.delete(image)
    db.commit()
    assert not db.query(Image).filter(Image.id == image.id).first()
