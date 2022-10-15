from app.models.product import Product


def product_seed(fake, session, category_id):
    product_id = []

    for i in range(60):
        random_category_id = category_id[
            fake.random_int(min=0, max=len(category_id) - 1, step=1)
        ]
        product = Product.seed(fake, random_category_id)
        session.add(product)
        product_id.append(product.id)

    return product_id
