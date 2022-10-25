from app.models.wishlist import Wishlist


def wishlist_seed(fake, session, user_id, product_id):
    wishlist_id = []

    for user in user_id:
        random_product_id = fake.random_elements(
            elements=product_id, unique=True, length=fake.random_int(min=1, max=5)
        )
        for random_product in random_product_id:
            wishlist = Wishlist.seed(fake, user, random_product)
            session.add(wishlist)
            wishlist_id.append(wishlist.id)

    return wishlist_id
