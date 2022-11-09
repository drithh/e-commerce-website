from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}/home"


def test_get_empty_banners(client: TestClient):
    resp = client.get(f"{prefix}/banner")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no banners"}


def test_get_banners(client: TestClient, create_banner):
    banner = create_banner()

    resp = client.get(f"{prefix}/banner")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(banner.id)


def test_get_empty_categories(client: TestClient):
    resp = client.get(f"{prefix}/category")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no categories"}


def test_get_categories(client: TestClient, create_category):
    category = create_category()

    resp = client.get(f"{prefix}/category")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(category.id)


def test_get_empty_best_seller(client: TestClient):
    resp = client.get(f"{prefix}/best-seller")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no best seller items"}


def test_get_best_seller(
    client: TestClient,
    create_order,
    create_order_item,
    create_product,
    create_product_size_quantity,
):
    order = create_order()
    product = create_product()
    product_size_quantity = create_product_size_quantity(product=product)
    create_order_item(order, product_size_quantity)

    resp = client.get(f"{prefix}/best-seller")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(product.id)
