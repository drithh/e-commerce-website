import bcrypt
from sqlalchemy import Column, String, Boolean
from db import Base
from models.default import DefaultModel


class User(DefaultModel, Base):
    __tablename__ = "users"

    name = Column(String(length=64), nullable=False)
    email = Column(String(length=64), unique=True, index=True, nullable=False)

    password = Column(String(length=72), nullable=False)
    salt = Column(String(length=64), nullable=False)

    phone_number = Column(String(length=64), nullable=False)
    address = Column(String(length=64), nullable=False)
    city = Column(String(length=64), nullable=False)
    balance = Column(String(length=64), nullable=False, default=0)

    is_admin = Column(Boolean, nullable=False, default=False)

    @classmethod
    def seed(cls, fake):
        password, salt = cls.encrypt_password("password")
        user = User(
            name=fake.name(),
            email=fake.email(),
            password=password,
            salt=salt,
            phone_number=fake.phone_number(),
            address=fake.address(),
            city=fake.city(),
            balance=fake.pyint(),
        )
        return user

    @classmethod
    def encrypt_password(cls, password):
        salt = bcrypt.gensalt()
        password = password.encode("utf-8")
        salt = salt.decode("utf-8")
        hashed_password = bcrypt.hashpw(password, salt.encode("utf-8"))
        return hashed_password.decode("utf-8"), salt

    @classmethod
    def verify_password(cls, password, hashed_password, salt):
        password = password.encode("utf-8")
        salt = salt.encode("utf-8")
        hashed_password = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password, hashed_password)
