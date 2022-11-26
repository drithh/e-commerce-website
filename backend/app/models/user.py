import bcrypt
from sqlalchemy import BigInteger, Boolean, Column, String

from app.db import Base
from app.models.default import DefaultModel


class User(DefaultModel, Base):
    __tablename__ = "users"

    name = Column(String(length=64), nullable=False)
    email = Column(String(length=64), unique=True, index=True, nullable=False)

    password = Column(String(length=128), nullable=False)
    salt = Column(String(length=128), nullable=False)

    phone_number = Column(String(length=64), nullable=False)
    address_name = Column(String(length=64), nullable=True)
    address = Column(String(length=128), nullable=True)
    city = Column(String(length=64), nullable=True)
    balance = Column(BigInteger, nullable=False, server_default="0")

    is_admin = Column(Boolean, nullable=False, server_default="false")

    @classmethod
    def default_user_seed(cls, fake):
        password, salt = cls.encrypt_password("user")
        user = User(
            id=fake.uuid4(),
            name="user",
            email="user@user.com",
            password=password,
            salt=salt,
            phone_number=fake.phone_number(),
            address_name=fake.text(max_nb_chars=24),
            address=fake.address(),
            city=fake.city(),
            balance=fake.pyint(),
        )
        return user

    @classmethod
    def default_admin_seed(cls, fake):
        password, salt = cls.encrypt_password("admin")
        admin = User(
            id=fake.uuid4(),
            name="admin",
            email="admin@admin.com",
            password=password,
            salt=salt,
            phone_number=fake.phone_number(),
            address_name=fake.text(max_nb_chars=24),
            address=fake.address(),
            city=fake.city(),
            balance=fake.pyint(),
            is_admin=True,
        )
        return admin

    @classmethod
    def seed(cls, fake, password="password"):
        hashed_password, salt = cls.encrypt_password(password)
        user = User(
            id=fake.uuid4(),
            name=fake.name(),
            email=fake.email(),
            password=hashed_password,
            salt=salt,
            phone_number=fake.phone_number(),
            address_name=fake.text(max_nb_chars=24),
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
    def verify_password(cls, password, user):
        hashed_password, salt = user.password, user.salt
        password = password.encode("utf-8")
        salt = salt.encode("utf-8")
        hashed_password = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password, hashed_password)
