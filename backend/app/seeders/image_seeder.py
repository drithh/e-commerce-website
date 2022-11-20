from app.models.image import Image


def image_seed(fake, session, image_urls):
    image_id = []
    for url in image_urls:
        name = url.split("/")[-1].split(".")[0]
        image = Image.seed(fake, name, url)
        session.add(image)
        image_id.append(image.id)
    return image_id
