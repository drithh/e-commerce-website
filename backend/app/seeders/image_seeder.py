from app.models.image import Image


def image_seed(fake, session):
    image_id = []
    image_items = [
        {
            "name": "banner",
            "amount": 6,
        },
        {
            "name": "category",
            "amount": 6,
        },
        {
            "name": "image",
            "amount": 60,
            "child_amount": 3,
        },
    ]
    for item in image_items:
        if item.get("child_amount"):
            for i in range(item["amount"]):
                for j in range(item["child_amount"]):
                    item_name = f"{item['name']}-{i+1}-{j+1}"
                    image = Image.seed(fake, item_name)
                    session.add(image)
                    image_id.append(image.id)
        else:
            for i in range(item["amount"]):
                item_name = f"{item['name']}-{i+1}"
                image = Image.seed(fake, item_name)
                session.add(image)
                image_id.append(image.id)
    return image_id
