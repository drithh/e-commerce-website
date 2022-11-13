from faker import Faker
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.session import Session

from app.models.category import Category

fake = Faker("id_ID")


def test_category_model(db: Session, create_category):
    category = create_category()
    assert db.query(Category).filter(Category.id == category.id).first()


def test_unique_category_title(db: Session):
    category = Category.seed(
        fake,
        "category_2",
        "product",
    )
    db.add(category)
    db.commit()

    category2 = Category.seed(
        fake,
        "category_2",
        "product",
    )
    db.add(category2)

    try:
        db.commit()
    except IntegrityError:
        assert True


def test_delete_category(db: Session, create_category):
    category = create_category()
    db.delete(category)
    db.commit()
    assert not db.query(Category).filter(Category.id == category.id).first()
