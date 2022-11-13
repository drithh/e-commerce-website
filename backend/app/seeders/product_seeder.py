from app.models.product import Product


def product_seed(fake, session, product_items):
    product_id = []

    for product_item in product_items:
        for item in product_item["item"]:
            product = Product.seed(
                fake, item["name"], item["price"], product_item["category"]
            )
            session.add(product)
            product_id.append(product.id)
    return product_id
