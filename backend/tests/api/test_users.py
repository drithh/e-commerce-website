import uuid

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
    fake_user_id = str(uuid.uuid4())

    resp = client.get(f"{prefix}/{fake_user_id}", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json() == {"message": "User not found"}


def test_get_user_details(client: TestClient, create_admin):
    user = create_admin()

    resp = client.get(f"{prefix}/{user.id}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == str(user.id)


def test_get_user_empty_orders(client: TestClient, create_user):
    user = create_user()
    resp = client.get(
        f"{prefix}/order",
        headers=get_jwt_header(user),
    )
    assert resp.json()["message"] == "You have no orders"
    assert resp.status_code == 404


def test_get_user_orders(
    client: TestClient, create_user, create_order, create_order_item
):
    user = create_user()
    order = create_order(user)
    create_order_item(order)
    resp = client.get(
        f"{prefix}/order",
        headers=get_jwt_header(user),
    )
    assert resp.json()["data"][0]["id"] == str(order.id)
    assert resp.status_code == 200


def test_get_user_shipping_address(client: TestClient, create_user):
    user = create_user()

    resp = client.get(f"{prefix}/shipping_address", headers=get_jwt_header(user))
    data = resp.json()
    assert data["id"] == str(user.id)
    assert resp.status_code == 200


def test_get_user_balance(client: TestClient, create_user):
    user = create_user()

    resp = client.get(f"{prefix}/balance", headers=get_jwt_header(user))
    data = resp.json()
    assert data["id"] == str(user.id)
    assert resp.status_code == 200


def test_update_user_shipping_address(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}/shipping_address",
        headers=get_jwt_header(user),
        json={
            "address_name": "Home",
            "phone_number": "08123456789",
            "address": "Jl. Jalan",
            "city": "Jakarta",
        },
    )
    data = resp.json()
    assert data["message"] == "Shipping address updated"
    assert resp.status_code == 200


def test_update_user_balance_value_error(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}/balance",
        headers=get_jwt_header(user),
        json={"balance": 9223372036854775807},
    )
    assert resp.json()['message'].startswith('Unknown error')
    assert resp.status_code == 400


def test_update_user_balance(client: TestClient, create_user):
    user = create_user()
    user_balance = user.balance

    resp = client.post(
        f"{prefix}/balance",
        headers=get_jwt_header(user),
        json={
            "balance": 100000,
        },
    )
    data = resp.json()
    expected_output = (
        f"Your balance has been updated, Current Balance: {user_balance + 100000}"
    )
    assert data["message"] == expected_output
    assert resp.status_code == 201


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


def test_delete_user_self(client: TestClient, create_admin):
    admin = create_admin()
    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={"id": str(admin.id)},
    )
    assert resp.status_code == 400
    assert resp.json() == {"message": "You can't delete yourself"}


def test_delete_user(client: TestClient, create_admin, create_user):
    admin = create_admin()
    user = create_user()
    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={"id": str(user.id)},
    )
    assert resp.status_code == 200
    assert resp.json() == {"message": "User deleted successfully"}
