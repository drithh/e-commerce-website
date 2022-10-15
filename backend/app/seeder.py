from faker import Faker

from app import db
from app.models.image import Image
from app.models.user import User


def seed():
    fake = Faker("id_ID")
    with db.SessionLocal() as session:
        user_id = user_seed(fake, session)

        session.commit()


def user_seed(fake, session):
    user_id = []
    admin, user = User.default_seed(fake)
    user_id.append(admin.id)
    user_id.append(user.id)
    session.add(admin)
    session.add(user)
    for _ in range(10):
        user = User.seed(fake)
        session.add(user)
        user_id.append(user.id)
    return user_id


def image_seed(fake, session, user_id):
    for _ in range(10):
        image = Image.seed(fake, user_id)
        session.add(image)


if __name__ == "__main__":
    seed()
