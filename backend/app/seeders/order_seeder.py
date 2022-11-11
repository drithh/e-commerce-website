from app.models.order import Order


def order_seed(fake, session, user_id):
    order_id = []
    statuses = ["processed", "shipped", "cancelled", "completed"]
    for user in user_id:
        for status in statuses:
            if status == "processed":
                iteration = fake.pyint(min_value=1, max_value=3)
            if status == "shipped":
                iteration = fake.pyint(min_value=1, max_value=2)
            if status == "cancelled":
                iteration = fake.pyint(min_value=1, max_value=4)
            if status == "completed":
                iteration = 72
            for i in range(iteration):
                if status == "completed":
                    order = Order.seed(
                        fake,
                        user,
                        status,
                        (i % (iteration // 6)) + 1,
                        2021 + round(i / iteration),
                    )
                else:
                    order = Order.seed(fake, user, status)
                session.add(order)
                order_id.append(order.id)

    return order_id
