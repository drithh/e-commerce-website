from starlette.testclient import TestClient

from app.core.config import settings
from sqlalchemy.orm.session import Session

prefix = f"{settings.API_PATH}"


def test_user_auth(client: TestClient, create_user, db: Session):
    # user register
    register = client.post(
        f"{prefix}/sign-up",
        json={
            "name": "adriel",
            "email": "adriel@gmail.com",
            "password": "adriel12345",
            "phone_number": "081234567890",
        },
    )

    assert register.status_code == 201
    assert register.json().get("access_token")

    authorization = {"Authorization ": f"Bearer {register.json().get('access_token')}"}

    # user forgot password
    forgot_password = client.post(
        f"{prefix}/forgot-password",
        params={"email": "adriel@gmail.com"},
    )

    assert forgot_password.status_code == 200
    assert (
        forgot_password.json().get("message")
        == "Reset password code will be sent to your email, please check your email"
    )

    # select user
    user = db.execute(
        "SELECT * FROM users WHERE email = :email",
        {"email": "adriel@gmail.com"},
    ).fetchone()

    # insert user to forgot_password table
    db.execute(
        "INSERT INTO forgot_passwords (token, user_id) VALUES (:token, :user_id)",
        {"token": "123456", "user_id": str(user.id)},
    )
    db.commit()

    # user reset password
    reset_password = client.post(
        f"{prefix}/reset-password",
        json={
            "token": "123456",
            "email": "adriel@gmail.com",
            "password": "adriel12345",
        },
    )

    assert reset_password.json().get("message") == "Password updated successfully"
    assert reset_password.status_code == 201

    # user sign in
    sign_in = client.post(
        f"{prefix}/sign-in",
        data={"username": "adriel@gmail.com", "password": "adriel12345"},
    )

    assert sign_in.status_code == 200
    assert sign_in.json().get("access_token")
