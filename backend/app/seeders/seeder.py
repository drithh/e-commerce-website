from faker import Faker

from app import db
from app.seeders.banner_seeder import banner_seed
from app.seeders.cart_seeder import cart_seed
from app.seeders.category_seeder import category_seed
from app.seeders.image_seeder import image_seed
from app.seeders.order_item_seeder import order_item_seed
from app.seeders.order_seeder import order_seed
from app.seeders.product_image_seeder import product_image_seed
from app.seeders.product_seeder import product_seed
from app.seeders.product_size_quantity_seeder import product_size_quantity_seed
from app.seeders.size_seeder import size_seed
from app.seeders.user_seeder import user_seed


def seed():
    fake = Faker("id_ID")
    with db.SessionLocal() as session:

        user_id = user_seed(fake, session)
        image_id = image_seed(fake, session)
        size_id = size_seed(fake, session)
        session.commit()

        category_id = category_seed(fake, session, image_id[:6])
        banner_seed(fake, session, image_id[6:12])
        session.commit()

        product_id = product_seed(fake, session, category_id)
        session.commit()

        product_image_seed(fake, session, product_id, image_id[12:])
        product_size_quantity_id = product_size_quantity_seed(
            fake, session, product_id, size_id
        )
        order_id = order_seed(fake, session, user_id)
        session.commit()

        order_item_seed(fake, session, order_id, product_size_quantity_id)
        cart_seed(fake, session, user_id, product_size_quantity_id)
        session.commit()


def delete():
    with db.SessionLocal() as session:
        session.execute("DELETE FROM carts")
        session.execute("DELETE FROM order_items")
        session.execute("DELETE FROM orders")
        session.execute("DELETE FROM product_size_quantities")
        session.execute("DELETE FROM product_images")
        session.execute("DELETE FROM products")
        session.execute("DELETE FROM banners")
        session.execute("DELETE FROM categories")
        session.execute("DELETE FROM sizes")
        session.execute("DELETE FROM images")
        session.execute("DELETE FROM users")
        session.commit()


if __name__ == "__main__":
    delete()
    seed()
