from typing import Generator

import pytest
from faker import Faker
from fastapi_users.password import PasswordHelper
from sqlalchemy.engine import create_engine
from sqlalchemy.orm.session import Session, sessionmaker
from starlette.testclient import TestClient

from app.core.config import settings
from app.db import Base
from app.deps.db import get_db
from app.factory import create_app

pytest_plugins = [
    "tests.fixtures.insert_data",
]

fake = Faker("id_ID")

engine = create_engine(
    settings.DATABASE_URL,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture(scope="session")
def app():
    return create_app()


@pytest.fixture(scope="session")
def client(app) -> Generator:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def db() -> Generator:
    session = TestingSessionLocal()
    yield session

    session.rollback()
    session.commit()


@pytest.fixture(scope="session", autouse=True)
def override_get_db(app):
    db = None
    try:
        db = TestingSessionLocal()
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        yield db
    finally:
        if db:
            db.close()
    app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def auto_rollback(db: Session):
    db.rollback()
    # clear all tables
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()
