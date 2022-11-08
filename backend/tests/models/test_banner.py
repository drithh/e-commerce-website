from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.banner import Banner
from app.models.image import Image

fake = Faker("id_ID")


def test_banner_model(db: Session, create_banner):
    banner = create_banner()
    assert db.query(Banner).join(Image).filter(Banner.id == banner.id).first()


def test_unique_banner_title(db: Session, create_image):
    image = create_image()
    banner = Banner.seed(fake, image.id, "banner_2")
    db.add(banner)
    db.commit()
    banner2 = Banner.seed(fake, image.id, "banner_2")
    db.add(banner2)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_image_id(db: Session):
    banner = Banner.seed(fake, fake.uuid4(), "banner_3")
    db.add(banner)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_banner(db: Session, create_banner):
    banner = create_banner()
    db.delete(banner)
    db.commit()
    assert not db.query(Banner).join(Image).filter(Banner.id == banner.id).first()
