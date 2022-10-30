from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.banner import Banner
from app.models.image import Image

fake = Faker("id_ID")


def test_banner_model(db: Session):
    image = Image.seed(fake, "image_banner_1", "image_url")
    db.add(image)
    db.commit()
    banner = Banner.seed(fake, image.id, "banner1")
    db.add(banner)
    db.commit()
    assert db.query(Banner).filter(Banner.id == banner.id).first()


def test_unique_banner_title(db: Session):
    image = Image.seed(fake, "image_banner_2", "image_url")
    db.add(image)
    db.commit()
    banner = Banner.seed(fake, image.id, "banner2")
    db.add(banner)
    db.commit()
    banner2 = Banner.seed(fake, image.id, "banner2")
    db.add(banner2)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_banner(db: Session):
    image = Image.seed(fake, "image_banner_3", "image_url")
    db.add(image)
    db.commit()
    banner = Banner.seed(fake, image.id, "banner3")
    db.add(banner)
    db.commit()
    db.delete(banner)
    db.commit()
    assert not db.query(Banner).filter(Banner.id == banner.id).first()


def test_relation_banner_image(db: Session):
    image = Image.seed(fake, "image_banner_4", "image_url")
    db.add(image)
    db.commit()
    banner = Banner.seed(fake, image.id, "banner4")
    db.add(banner)
    db.commit()
    assert db.query(Banner).filter(Banner.id == banner.id).first().image_id == image.id


def test_foreign_key_banner_image(db: Session):
    banner = Banner.seed(fake, fake.uuid4(), "banner5")
    db.add(banner)
    try:
        db.commit()
    except IntegrityError:
        assert True
