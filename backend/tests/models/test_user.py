from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.user import User

fake = Faker("id_ID")


def test_user_model(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()
    assert db.query(User).filter(User.id == user.id).first()


def test_unique_user_email(db: Session):
    user = User.seed(fake)
    user.email = "test@test.com"
    db.add(user)
    db.commit()
    user2 = User.seed(fake)
    user2.email = "test@test.com"
    db.add(user2)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_user(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()
    db.delete(user)
    db.commit()
    assert not db.query(User).filter(User.id == user.id).first()


def test_update_user(db: Session):
    user = User.seed(fake)
    db.add(user)
    db.commit()
    user.phone_number = fake.phone_number()
    db.commit()
    current_phone_number = (
        db.query(User).filter(User.id == user.id).first().phone_number
    )
    assert current_phone_number == user.phone_number
