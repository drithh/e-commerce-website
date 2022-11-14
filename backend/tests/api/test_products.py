from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}/products"


def test_get_empty_products(client: TestClient):
    resp = client.get(f"{prefix}")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no products"}


def test_get_products(client: TestClient, create_product):
    product = create_product()

    resp = client.get(f"{prefix}")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(product.id)


def test_get_empty_product(client: TestClient):
    resp = client.get(f"{prefix}/df2ecf60-6132-4084-b5c2-9ac686452322")
    assert resp.status_code == 404
    assert resp.json() == {"message": "Product not found"}


def test_get_product(client: TestClient, create_product):
    product = create_product()

    resp = client.get(f"{prefix}/{product.id}")
    assert resp.status_code == 200
    data = resp.json()["id"]
    assert data == str(product.id)


# def test_create_product(client: TestClient, create_product):
#     product = create_product()

#     resp = client.post(f"{prefix}",
#         json={
#             "id ": str(product.id),
#             "title": product.title,
#             "brand": product.brand,
#             "product_detail": product.product_detail,
#             "price": product.price,
#             'condition': product.condition,
#             "category_id": str(product.category_id),
#         })
#     assert resp.status_code == 201
#     # data = resp.json()
#     # assert data["id"] == str(product.id)
