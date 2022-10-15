from app.models.product_size_quantity import ProductSizeQuantity


def product_size_quantity_seed(fake, session, product_id, size_id):
    product_size_quantity_id = []

    for product in product_id:
        for size in size_id:
            product_size_quantity = ProductSizeQuantity.seed(fake, product, size)
            session.add(product_size_quantity)
            product_size_quantity_id.append(product_size_quantity.id)

    return product_size_quantity_id
