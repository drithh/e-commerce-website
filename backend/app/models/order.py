import datetime

from sqlalchemy import Column, ForeignKey, Integer, String

from app.db import Base
from app.models.default import DefaultModel


class Order(DefaultModel, Base):
    __tablename__ = "orders"

    status = Column(String(length=64), nullable=False, default="processed")
    address = Column(String(length=128), nullable=False)
    address_name = Column(String(length=64), nullable=False)
    phone_number = Column(String(length=64), nullable=False)
    city = Column(String(length=64), nullable=False)
    shipping_price = Column(Integer, nullable=False)
    shipping_method = Column(String(length=64), nullable=False)
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    @classmethod
    def seed(cls, fake, user_id, status, month=None, year=None):
        if month and year:
            start_date = datetime.datetime(year, month, 1)
            end_date = datetime.datetime(year, month, 28)
            date = fake.date_time_between(
                start_date=start_date, end_date=min(end_date, datetime.datetime.now())
            )
            order = Order(
                id=fake.uuid4(),
                status=status,
                address=fake.address(),
                address_name=fake.text(max_nb_chars=24),
                city=fake.city(),
                shipping_price=fake.pyint(min_value=1000),
                shipping_method=fake.random_element(elements=("Next Day", "Regular")),
                phone_number=fake.phone_number(),
                user_id=user_id,
                created_at=date,
                updated_at=date,
            )
        else:
            order = Order(
                id=fake.uuid4(),
                status=status,
                address=fake.address(),
                address_name=fake.text(max_nb_chars=24),
                city=fake.city(),
                shipping_price=fake.pyint(min_value=10, max_value=100) * 1000,
                shipping_method=fake.random_element(elements=("Next Day", "Regular")),
                phone_number=fake.phone_number(),
                user_id=user_id,
            )
        return order
