from app.models.category import Category


def category_seed(fake, session, categories):
    category_id = []

    for category_item in categories:
        category = Category.seed(fake, category_item["title"], category_item["type"])
        session.add(category)
        category_id.append(category.id)

    return category_id
