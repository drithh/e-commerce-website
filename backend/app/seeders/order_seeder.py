from app.models.order import Order


def order_seed(fake, session, user_id):
    order_id = []

    for user in user_id:
        order = Order.seed(fake, user)
        session.add(order)
        order_id.append(order.id)

    return order_id
