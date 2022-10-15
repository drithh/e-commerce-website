from app.models.banner import Banner


def banner_seed(fake, session, image_id):
    banner_id = []

    for item in image_id:
        banner = Banner.seed(fake, item)
        session.add(banner)
        banner_id.append(banner.id)

    return banner_id
