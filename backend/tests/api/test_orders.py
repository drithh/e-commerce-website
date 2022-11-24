import uuid

from sqlalchemy.orm.session import Session
from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/order"
prefix_admin = f"{settings.API_PATH}/orders"


def test_get_empty_orders_user(client: TestClient, create_user):
    user = create_user()

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json() == {"message": "You have no orders"}


def test_get_orders_user(
    client: TestClient, create_user, create_order, create_order_item
):
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
        f"{prefix}/1",
        headers=get_jwt_header(user),
    )
    assert resp.status_code == 404
    assert resp.json() == {"message": "Not Found"}


def test_get_order_detail(
    client: TestClient, create_user, db: Session, create_order, create_order_item
):
    user = create_user()
    order = create_order(user)
    create_order_item(order)

    resp = client.get(
        f"{prefix_admin}/{order.id}",
        headers=get_jwt_header(user),
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == str(order.id)


def test_get_empty_orders_admin(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.get(f"{prefix_admin}", headers=get_jwt_header(admin))
    assert resp.status_code == 404
    assert resp.json() == {"message": "No orders found"}


def test_get_orders_admin(
    client: TestClient, create_admin, create_user, create_order_item, create_order
):
    admin = create_admin()
    create_user()
    order = create_order()
    create_order_item(order)

    resp = client.get(
        f"{prefix_admin}",
        headers=get_jwt_header(admin),
    )
    assert resp.status_code == 200
    assert resp.json()["data"][0]["id"] == str(order.id)


def test_create_order(client: TestClient, create_user, create_cart):
    user = create_user()
    user.balance = 1000000
    create_cart(user)

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "Bali",
                "address": "Renon",
                "city": "Denpasar",
                "phone_number": "081123344556",
            },
            "send_email": False,
        },
    )
    assert resp.status_code == 201
    assert resp.json()["message"] == "Order created successfully"


def test_update_order_status(client: TestClient, create_user, db: Session):
    user = create_user()

    db.execute(
        """INSERT INTO orders (id, user_id, status, address, address_name, city, shipping_price, shipping_method)
        VALUES (:id, :user_id, :status, :address, :address_name, :city, :shipping_price, :shipping_method)""",
        {
            "id": uuid.uuid4(),
            "user_id": user.id,
            "status": "shipped",
            "address": "Renon",
            "address_name": "Bali",
            "city": "Denpasar",
            "shipping_price": 10000,
            "shipping_method": "Regular",
        },
    )
    db.commit()

    order = db.execute(
        "SELECT * FROM orders WHERE user_id = :user_id", {"user_id": user.id}
    ).fetchone()

    resp = client.put(
        f"{prefix}/{order.id}",
        headers=get_jwt_header(user),
    )
    assert resp.json()["message"] == "Order status updated"
    assert resp.status_code == 200


def test_update_order_admin(
    client: TestClient, create_admin, create_order, create_order_item
):
    admin = create_admin()
    order = create_order()
    create_order_item(order)

    resp = client.put(
        f"{prefix_admin}/{order.id}",
        headers=get_jwt_header(admin),
        params={
            "status": "shipped",
        },
    )
    assert resp.json()["message"] == "Order updated"
    assert resp.status_code == 200
