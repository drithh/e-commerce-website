from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}/order"
from tests.utils import get_jwt_header


def test_get_empty_orders_user(client: TestClient, create_user):
    user = create_user()

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json() == {"message": "You have no orders"}


def test_get_orders_user(client: TestClient, create_user, create_order, create_order_item):
    user = create_user()
    order = create_order(user)
    create_order_item(order)

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(order.id)


def test_get_empty_order_detail(client: TestClient, create_user):
    user = create_user()

    resp = client.get(
        f"{prefix}/3fa85f64-5717-4562-b3fc-2c963f66afa6", 
            headers=get_jwt_header(user),
        )
    assert resp.status_code == 404
    assert resp.json() == {"message": "Order not found"}


def test_get_order_detail(client: TestClient, create_user, create_order, create_order_item):
    user = create_user()
    order = create_order(user)
    create_order_item(order)
    # product = create_product()
    # size = create_size()
    # product_size_quantity = create_product_size_quantity(product, size)
    # create_order_item(order, product_size_quantity)

    resp = client.get(
        f"{prefix}/{order.id}", 
        headers=get_jwt_header(user),
    )
    assert resp.status_code == 200
    data = resp.json()["id"]
    assert data == str(order.id)


def test_get_empty_orders_admin(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.get(f"{prefix}", headers=get_jwt_header(admin))
    assert resp.status_code == 404
    assert resp.json() == {"message": "You have no orders"}


def test_get_orders_admin(client: TestClient, create_admin, create_order, create_order_item):
    admin = create_admin()
    order = create_order(admin)
    create_order_item(order)

    resp = client.get(f"{prefix}", headers=get_jwt_header(admin))
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(order.id)


def test_create_order(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "Bali",
                "address": "Renon",
                "city": "Denpasar",
                "phone_number": "081123344556"
            },
            "send_email": False
        },
    )
    data = resp.json()
    assert data["message"] == "Order Created"
    assert resp.status_code == 201


def test_update_order_status(client: TestClient, create_admin, create_order, create_order_item):
    admin = create_admin()
    order = create_order(admin)
    order_item = create_order_item(order)

    resp = client.put(
        f"{prefix}/{order.id}",
        headers=get_jwt_header(admin),
    )
    data = resp.json()
    assert data["message"] == "Order updated"
    assert resp.status_code == 200

{
    "shipping_method": "Regular",
    "shipping_address": {
        "address_name": "Bali",
        "address": "Renon",
        "city": "Denpasar",
        "phone_number": "081123344556"
    },
    "send_email": False
}