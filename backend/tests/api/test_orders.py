import uuid

from sqlalchemy.orm.session import Session
from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/order"
prefix_admin = f"{settings.API_PATH}/orders"


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
    client: TestClient,
    create_admin,
    create_user,
    create_order_item,
    create_order_with_time,
):
    admin = create_admin()
    create_user()
    order = create_order_with_time()
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


def test_create_order_insufficient_balance(
    client: TestClient,
    create_user,
    create_cart,
):
    user = create_user()
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
    assert resp.status_code == 400
    assert resp.json()["message"].startswith("Not enough balance")


def test_create_order_without_adrress_name(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "",
                "address": "",
                "city": "",
                "phone_number": "",
            },
        },
    )
    assert resp.json()["message"] == "Address name is empty"
    assert resp.status_code == 400


def test_create_order_without_adrress(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "lokotre",
                "address": "",
                "city": "",
                "phone_number": "",
            },
        },
    )
    assert resp.json()["message"] == "Address is empty"
    assert resp.status_code == 400


def test_create_order_without_city(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "lokotre",
                "address": "hehe",
                "city": "",
                "phone_number": "",
            },
        },
    )
    assert resp.json()["message"] == "City is empty"
    assert resp.status_code == 400


def test_create_order_without_phone(client: TestClient, create_user):
    user = create_user()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "lokotre",
                "address": "hehe",
                "city": "hoho",
                "phone_number": "",
            },
        },
    )
    assert resp.json()["message"] == "Phone number is empty"
    assert resp.status_code == 400


def test_create_order_without_cart(client: TestClient, create_user):
    user = create_user()
    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "lokotre",
                "address": "hehe",
                "city": "hoho",
                "phone_number": "123",
            },
        },
    )
    assert resp.json()["message"] == "Cart is empty"
    assert resp.status_code == 404


def test_create_order_no_quantitiy(
    client: TestClient,
    create_user,
    create_cart,
    create_product,
    create_size,
    db: Session,
):
    user = create_user()
    user.balance = 1000000
    product = create_product()
    size = create_size()
    db.execute(
        """
            INSERT INTO product_size_quantities (quantity, product_id, size_id)
            VALUES (0, :product_id, :size_id)
        """,
        {"product_id": product.id, "size_id": size.id},
    )
    db.commit()
    product_size_quantity = db.execute(
        """
            SELECT * FROM product_size_quantities
            WHERE product_id = :product_id AND size_id = :size_id
        """,
        {"product_id": product.id, "size_id": size.id},
    ).fetchone()

    create_cart(user, product_size_quantity)

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "lokotre",
                "address": "hehe",
                "city": "hoho",
                "phone_number": "123",
            },
        },
    )
    assert resp.json()["message"].startswith("Product")
    assert resp.status_code == 400


def test_update_empty_order_status(client: TestClient, create_user):
    user = create_user()
    order_id = uuid.uuid4()
    resp = client.put(
        f"{prefix}/{order_id}",
        headers=get_jwt_header(user),
    )
    assert resp.json() == {"message": "Order does not exist"}
    assert resp.status_code == 400


def test_update_order_status_not_shipped(client: TestClient, create_user, db: Session):
    user = create_user()

    db.execute(
        """INSERT INTO orders (id, user_id, status, address, address_name, city, shipping_price, shipping_method)
        VALUES (:id, :user_id, :status, :address, :address_name, :city, :shipping_price, :shipping_method)""",
        {
            "id": uuid.uuid4(),
            "user_id": user.id,
            "status": "processed",
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
    assert resp.json()["message"] == "Order status is not shipped"
    assert resp.status_code == 400


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
            "order_status": "shipped",
        },
    )
    assert resp.json()["message"] == "Order updated"
    assert resp.status_code == 200


def test_update_empty_order_admin(client: TestClient, create_admin):
    admin = create_admin()
    order_id = uuid.uuid4()
    resp = client.put(
        f"{prefix_admin}/{order_id}",
        headers=get_jwt_header(admin),
        params={
            "order_status": "shipped",
        },
    )
    assert resp.json() == {"message": "Order not found"}
    assert resp.status_code == 404


def test_get_shipping_price(
    client: TestClient,
    create_user,
    create_cart,
    create_product_size_quantity,
    create_product,
    create_size,
):
    user = create_user()
    product = create_product()
    size = create_size()
    product_size_quantity = create_product_size_quantity(product, size)
    create_cart(user, product_size_quantity)
    resp = client.get(
        "/shipping_price",
        headers=get_jwt_header(user),
    )
    assert resp.status_code == 200
