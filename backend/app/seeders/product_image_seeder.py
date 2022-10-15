from app.models.product_image import ProductImage


def product_image_seed(fake, session, product_id, image_id):
    product_image_id = []

    for index, image in enumerate(image_id):
        product = product_id[index // 6]
        product_image = ProductImage.seed(fake, product, image)
        session.add(product_image)
        product_image_id.append(product_image.id)

    return product_image_id
