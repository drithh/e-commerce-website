from app.models.banner import Banner


def banner_seed(fake, session, image_id, banner_text):
    banner_id = []

    for image, text in zip(image_id, banner_text):
        banner = Banner.seed(fake, image, text)
        session.add(banner)
        banner_id.append(banner.id)

    return banner_id
