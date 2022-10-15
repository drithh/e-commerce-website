from app.models.order_item import OrderItem


def order_item_seed(fake, session, order_id, product_size_quantity_id):
    order_item_id = []

    for order in order_id:
        random_size_order_item = fake.random_int(min=1, max=10)
        for index, product_size_quantity in enumerate(product_size_quantity_id):
            if index < random_size_order_item:
                order_item = OrderItem.seed(fake, order, product_size_quantity)
                session.add(order_item)
                order_item_id.append(order_item.id)

    return order_item_id
