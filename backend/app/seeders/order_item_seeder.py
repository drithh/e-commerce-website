from app.models.order_item import OrderItem


def order_item_seed(fake, session, order_id, product_size_quantity_id):
    order_item_id = []

    for order in order_id:
        # get random 5 to 10 product size quantity
        iteration = fake.pyint(min_value=3, max_value=6)
        for _ in range(iteration):
            order_item = OrderItem.seed(
                fake,
                order,
                product_size_quantity_id[
                    fake.pyint(min_value=0, max_value=len(product_size_quantity_id) - 1)
                ],
            )
            session.add(order_item)
            order_item_id.append(order_item.id)

    return order_item_id
