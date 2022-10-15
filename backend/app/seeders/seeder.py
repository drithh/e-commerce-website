from faker import Faker

from app import db
from app.seeders.user_seeder import user_seed
from app.seeders.image_seeder import image_seed
from app.seeders.category_seeder import category_seed
from app.seeders.banner_seeder import banner_seed


def seed():
    fake = Faker("id_ID")
    with db.SessionLocal() as session:
        user_id = user_seed(fake, session)
        image_id = image_seed(fake, session)
        session.commit()
        category_id = category_seed(fake, session, image_id[:6])
        banner_id = banner_seed(fake, session, image_id[6:12])
        session.commit()


if __name__ == "__main__":
    seed()
