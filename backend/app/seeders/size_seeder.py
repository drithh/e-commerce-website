from app.models.size import Size


def size_seed(fake, session):
    size_id = []
    size_list = ["S", "M", "L", "XL", "XXL"]
    for item in size_list:
        size = Size.seed(fake, item)
        session.add(size)
        size_id.append(size.id)

    return size_id
