from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/admin"


def test_get_sales(client: TestClient, create_admin):
    user = create_admin()
    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    assert resp.json().get("data").get("total_sales") == 0


def test_get_dashboard(client: TestClient, create_admin):
    user = create_admin()
    resp = client.get(f"{prefix}/dashboard", headers=get_jwt_header(user))
    assert resp.status_code == 200
    assert resp.json().get("income_per_month") == []


def test_get_customer_no_customer(client: TestClient, create_admin):
    user = create_admin()
    resp = client.get(f"{prefix}/customer", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json().get("message") == "You don't have any customer"


def test_get_customer(client: TestClient, create_admin, create_default_user):
    admin = create_admin()
    user = create_default_user()
    resp = client.get(f"{prefix}/customer", headers=get_jwt_header(admin))
    assert resp.status_code == 200
    assert resp.json().get("data")[0].get("id") == str(user.id)


def test_get_order_no_order(client: TestClient, create_admin):
    user = create_admin()
    resp = client.get(f"{prefix}/order", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json().get("message") == "You don't have any order"


def test_get_order(
    client: TestClient,
    create_admin,
    create_order,
    create_order_item,
    create_size,
    create_product_size_quantity,
):
    admin = create_admin()
    order = create_order(admin)
    create_order_item(order)
    resp = client.get(f"{prefix}/order", headers=get_jwt_header(admin))
    assert resp.status_code == 200
    assert resp.json().get("data")[0].get("id") == str(order.id)
