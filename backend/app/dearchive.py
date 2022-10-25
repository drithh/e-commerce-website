from app import db


def dearhived():
    # remove all data from archive table

    with db.SessionLocal() as session:
        session.execute("DELETE FROM z_archive_users")
        session.execute("DELETE FROM z_archive_images")
        session.execute("DELETE FROM z_archive_sizes")
        session.execute("DELETE FROM z_archive_banners")
        session.execute("DELETE FROM z_archive_categories")
        session.execute("DELETE FROM z_archive_products")
        session.execute("DELETE FROM z_archive_carts")
        session.execute("DELETE FROM z_archive_orders")
        session.execute("DELETE FROM z_archive_order_items")
        session.execute("DELETE FROM z_archive_product_size_quantities")
        session.execute("DELETE FROM z_archive_product_images")
        session.execute("DELETE FROM z_archive_wishlists")
        session.commit()


if __name__ == "__main__":
    dearhived()
