from datetime import datetime, timedelta

from sqlalchemy.orm.session import Session
from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}"


def test_get_role_guest(client: TestClient):
    resp = client.get(f"{prefix}/role")
    assert resp.status_code == 200
    assert resp.json() == {"message": "guest"}


def test_get_role_user(client: TestClient, create_user):
    user = create_user()
    resp = client.get(f"{prefix}/role", headers=get_jwt_header(user))
    assert resp.status_code == 200
    assert resp.json() == {"message": "user"}


def test_sign_in_unregistered_user(client: TestClient):
    resp = client.post(
        f"{prefix}/sign-in",
        data={"username": "unregistered_user", "password": "password"},
    )
    assert resp.status_code == 401
    assert resp.json().get("message") == "Invalid authentication credentials"


def test_sign_in_wrong_password(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}/sign-in",
        data={"username": user.email, "password": "wrong_password"},
    )
    assert resp.status_code == 401
    assert resp.json().get("message") == "Incorrect password"


def test_sign_in(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}/sign-in",
        data={"username": user.email, "password": user.password},
    )
    assert resp.status_code == 200
    assert resp.json().get("message") == "Login success"


def test_sign_up_invalid_email(client: TestClient):
    resp = client.post(
        f"{prefix}/sign-up",
        json={
            "name": "test",
            "email": "test.com",
            "password": "password",
            "phone_number": "1234567890",
        },
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Email is not valid"


def test_sign_up_invalid_password(client: TestClient):
    resp = client.post(
        f"{prefix}/sign-up",
        json={
            "name": "test",
            "email": "test@test.com",
            "password": "pass",
            "phone_number": "1234567890",
        },
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Password must be at least 8 characters"


def test_sign_up_already_registered_user(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}/sign-up",
        json={
            "name": user.name,
            "email": user.email,
            "password": "password123",
            "phone_number": user.phone_number,
        },
    )

    assert resp.status_code == 400
    assert resp.json().get("message") == "Email already registered"


def test_sign_up(client: TestClient):
    resp = client.post(
        f"{prefix}/sign-up",
        json={
            "name": "test",
            "email": "test@test.com",
            "password": "pass12312",
            "phone_number": "1234567890",
        },
    )
    assert resp.status_code == 201
    assert resp.json().get("message") == "success, user created"


def test_forgot_password_invalid_email(client: TestClient):
    resp = client.post(
        f"{prefix}/forgot-password",
        params={"email": "test@test.com"},
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Email not registered"


def test_forgot_password(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}/forgot-password",
        params={"email": user.email},
    )
    assert resp.status_code == 200
    assert resp.json().get("message") == "Reset password link sent to your email"


def test_reset_password_invalid_token(client: TestClient):
    resp = client.post(
        f"{prefix}/reset-password",
        json={"token": "invalid_token", "password": "password123"},
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Invalid token"


def test_reset_expired_token(client: TestClient, create_user, db: Session):
    user = create_user()
    db.execute(
        "INSERT INTO forgot_passwords (user_id, token, expires_in) VALUES (:user_id, :token, :expires_in)",
        {
            "user_id": user.id,
            "token": "expired_token",
            "expires_in": datetime.now() - timedelta(hours=1),
        },
    )
    db.commit()

    resp = client.post(
        f"{prefix}/reset-password",
        json={"token": "expired_token", "password": "password123"},
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Token expired"


def test_reset_password(client: TestClient, create_user, db: Session):
    user = create_user()
    db.execute(
        "INSERT INTO forgot_passwords (user_id, token, expires_in) VALUES (:user_id, :token, :expires_in)",
        {
            "user_id": user.id,
            "token": "valid_token",
            "expires_in": datetime.now() + timedelta(hours=1),
        },
    )
    db.commit()

    resp = client.post(
        f"{prefix}/reset-password",
        json={"token": "valid_token", "password": "password123"},
    )
    assert resp.status_code == 201
    assert resp.json().get("message") == "Password updated successfully"


def test_change_password_invalid_password(client: TestClient, create_user):
    user = create_user()
    resp = client.put(
        f"{prefix}/change-password",
        headers=get_jwt_header(user),
        json={"old_password": "wrong_password", "new_password": "password123"},
    )
    assert resp.status_code == 400
    assert resp.json().get("message") == "Your old password is incorrect"


def test_change_password(client: TestClient, create_user):
    user = create_user()
    resp = client.put(
        f"{prefix}/change-password",
        headers=get_jwt_header(user),
        json={"old_password": user.password, "new_password": "password123"},
    )
    assert resp.status_code == 201
    assert resp.json().get("message") == "Password updated successfully"
