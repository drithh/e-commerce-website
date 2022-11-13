from app.models.user import User


def user_seed(fake, session):
    user_id = []
    admin, user = User.default_seed(fake)
    user_id.append(user.id)
    session.add(admin)
    session.add(user)
    for _ in range(49):
        user = User.seed(fake)
        session.add(user)
        user_id.append(user.id)
    return user_id
