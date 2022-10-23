from app.models.category import Category


def category_seed(fake, session, categories, image_id):
    category_id = []

    for category_item, image in zip(categories, image_id):
        category = Category.seed(fake, category_item, image)
        session.add(category)
        category_id.append(category.id)

    return category_id
