from app.models.cart import Cart


def cart_seed(fake, session, user_id, product_size_quantity_id):
    cart_id = []
    for user in user_id:
        product_size_quantities = fake.random.sample(
            product_size_quantity_id, fake.random_int(min=1, max=10)
        )
        for product_size_quantity in product_size_quantities:
            cart = Cart.seed(fake, user, product_size_quantity)
            session.add(cart)
            cart_id.append(cart.id)

    return cart_id
