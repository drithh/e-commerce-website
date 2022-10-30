from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.size import Size

fake = Faker("id_ID")


def test_size_model(db: Session):
    size = Size.seed(fake, "size_1")
    db.add(size)
    db.commit()
    assert db.query(Size).filter(Size.id == size.id).first()


def test_unique_size_name(db: Session):
    size = Size.seed(fake, "size_2")
    db.add(size)
    db.commit()
    size2 = Size.seed(fake, "size_2")
    db.add(size2)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_size(db: Session):
    size = Size.seed(fake, "size_3")
    db.add(size)
    db.commit()
    db.delete(size)
    db.commit()
    assert not db.query(Size).filter(Size.id == size.id).first()
