from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/user"


def test_get_user(client: TestClient, create_admin):
    user = create_admin()

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == str(user.id)


def test_get_empty_user_details(client: TestClient, create_admin):
    user = create_admin()

    resp = client.get(
        f"{prefix}/df2ecf60-6132-4084-b5c2-9ac686452322", headers=get_jwt_header(user)
    )
    assert resp.status_code == 404
    assert resp.json() == {"message": "User not found"}


def test_get_user_details(client: TestClient, create_admin):
    user = create_admin()

    resp = client.get(f"{prefix}/{user.id}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == str(user.id)


# def test_get_user_shipping_address(client: TestClient, create_admin):
#     user = create_admin()

#     resp = client.get(f"{prefix}/shipping_address", headers=get_jwt_header(user))
#     data = resp.json()
#     assert data == str(user.id)
#     assert resp.status_code == 200


def test_update_user(client: TestClient, create_admin):
    user = create_admin()

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "id": str(user.id),
            "name": "new name",
            "email": "ayambetutu@gmai8l.com",
            "phone_number": "08123456789",
            "address_name": "home",
            "address": "Jl. Jalan",
            "city": "Jakarta",
            "balance": 1000000,
        },
    )
    data = resp.json()
    assert data["message"] == "User updated successfully"
    assert resp.status_code == 200


def test_delete_user(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "id": str(admin.id),
        },
    )
    assert resp.status_code == 204


# def test_delete_empty_user(client: TestClient, create_admin):
#     admin = create_admin()

#     resp = client.delete(
#         f"{prefix}",
#         headers=get_jwt_header(admin),
#         json={
#             "id" : str(uuid.uuid4()),
#         }
#     )
#     assert resp.status_code == 400
#     assert resp.json() == {"message": "User not found"}
