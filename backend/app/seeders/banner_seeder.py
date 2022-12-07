from app.models.banner import Banner


def banner_seed(fake, session, image_id, banners):
    banner_id = []

    for image, banner in zip(image_id, banners):
        banner = Banner.seed(fake, image, banner["title"], banner["text_position"])
        session.add(banner)
        banner_id.append(banner.id)

    return banner_id
