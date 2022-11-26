from app.models.user import User


def user_seed(fake, session):
    user_id = []
    admin = User.default_admin_seed(fake)
    user = User.default_user_seed(fake)
    user_id.append(user.id)
    session.add(admin)
    session.add(user)
    for _ in range(49):
        user = User.seed(fake)
        session.add(user)
        user_id.append(user.id)
    return user_id
