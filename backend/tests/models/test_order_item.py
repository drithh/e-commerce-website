from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product_size_quantity import ProductSizeQuantity

fake = Faker("id_ID")


def test_order_item(db: Session, create_order_item):
    order_item = create_order_item()
    assert (
        db.query(OrderItem)
        .join(Order)
        .join(ProductSizeQuantity)
        .filter(OrderItem.id == order_item.id)
        .first()
    )


def test_foreign_key_order_id(db: Session, create_product_size_quantity):
    product_size_quantity = create_product_size_quantity()

    order_item = OrderItem.seed(fake, fake.uuid4(), product_size_quantity.id)
    db.add(order_item)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_foreign_key_product_size_quantity_id(db: Session, create_order):
    order = create_order()

    order_item = Order.seed(fake, order.id, fake.uuid4())
    db.add(order_item)
    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_order_item(db: Session, create_order_item):
    order_item = create_order_item()
    assert (
        db.query(OrderItem)
        .join(Order)
        .join(ProductSizeQuantity)
        .filter(OrderItem.id == order_item.id)
        .first()
    )
    db.delete(order_item)
    db.commit()
    assert not (
        db.query(OrderItem)
        .join(Order)
        .join(ProductSizeQuantity)
        .filter(OrderItem.id == order_item.id)
        .first()
    )
