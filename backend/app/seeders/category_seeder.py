from app.models.category import Category


def category_seed(fake, session, image_id):
    category_id = []

    for item in image_id:
        category = Category.seed(fake, item)
        session.add(category)
        category_id.append(category.id)

    return category_id
