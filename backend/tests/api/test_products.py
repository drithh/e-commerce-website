from starlette.testclient import TestClient

from app.core.config import settings
from app.deps.image_base64 import base64_to_image
from tests.utils import get_jwt_header

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


# def test_create_product(client: TestClient, create_category, create_admin, create_image):

#     category = create_category()
#     admin = create_admin()

#     resp = client.post(f"{prefix}",
#         headers=get_jwt_header(admin),
#         json={
#             "title": "hehe",
#             "brand": 'hoho',
#             "product_detail": 'haha',
#             'images': [""],
#             "price": 10000,
#             'condition': 'mew',
#             "category_id": str(category.id),
#         })
#     data = resp.json()
#     assert data['message'] == {}
#     assert resp.status_code == 201


def test_delete_product_not_admin(client: TestClient, create_product):
    product = create_product()

    resp = client.delete(f"{prefix}/{product.id}")
    assert resp.status_code == 401
    assert resp.json() == {"message": "Not authenticated"}


def test_delete_product(client: TestClient, create_product, create_admin):
    admin = create_admin()
    product = create_product()

    resp = client.delete(f"{prefix}/{product.id}", headers=get_jwt_header(admin))
    assert resp.status_code == 200
    assert resp.json() == {"message": "Product deleted"}


def test_update_product_not_admin(client: TestClient):

    resp = client.put(f"{prefix}")
    assert resp.json() == {"message": "Not authenticated"}
    assert resp.status_code == 401


def test_update_product(client: TestClient, create_product, create_admin):
    admin = create_admin()
    product = create_product()
    assert type(product.title) == str

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "id": str(product.id),
            "title": "galilei",
            "brand": "galileo",
            "product_detail": "aiueo",
            "images": ["aiueo"],
            "price": 10000,
            "category_id": str(product.category_id),
            "condition": "new",
            "stock": [{"size": "S", "quantity": 10}],
        },
    )
    assert resp.json() == {"message": "Product updated"}
    assert resp.status_code == 200
