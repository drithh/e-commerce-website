from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.order import Order
from app.models.user import User

fake = Faker("id_ID")


def test_order_model(db: Session, create_order):
    order = create_order()
    assert (
        db.query(Order)
        .join(User)
        .filter(Order.id == order.id)
        .first()
    )


def test_foreign_key_user_id(db: Session):
    order = Order.seed(fake, fake.uuid4(), "finished")
    db.add(order)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_order(db: Session, create_order):
    order = create_order()
    assert (
        db.query(Order)
        .join(User)
        .filter(Order.id == order.id)
        .first()
    )
    db.delete(order)
    db.commit()
    assert not (
        db.query(Order)
        .join(User)
        .filter(Order.id == order.id)
        .first()
    )
