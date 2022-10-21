from app.models.favorite import Favorite


def favorite_seed(fake, session, user_id, product_id):
    favorite_id = []

    for user in user_id:
        random_product_id = fake.random_elements(
            elements=product_id, unique=True, length=fake.random_int(min=1, max=5)
        )
        for random_product in random_product_id:
            favorite = Favorite.seed(fake, user, random_product)
            session.add(favorite)
            favorite_id.append(favorite.id)

    return favorite_id
