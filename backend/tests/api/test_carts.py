from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}/cart"
from tests.utils import get_jwt_header


def test_get_empty_cart(client: TestClient, create_user):
    user = create_user()

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 404
    assert resp.json() == {"message": "You have no carts"}


def test_get_cart(
    client: TestClient,
    create_user,
    create_cart,
    create_product,
    create_size,
    create_product_size_quantity,
):
    user = create_user()
    product = create_product()
    size = create_size()
    product_size_quantity = create_product_size_quantity(product, size)
    cart = create_cart(user, product_size_quantity)

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(cart.id)


def test_create_cart(
    client: TestClient,
    create_user,
    create_product,
    create_size,
    create_product_size_quantity,
):
    user = create_user()
    product = create_product()
    size = create_size()
    create_product_size_quantity(product, size)

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        json={"product_id": str(product.id), "quantity": "1", "size": str(size.size)},
    )
    data = resp.json()
    assert data["message"] == "Added to cart"
    assert resp.status_code == 201


def test_update_cart(
    client: TestClient,
    create_user,
    create_cart,
    create_product,
    create_size,
    create_product_size_quantity,
):
    user = create_user()
    product = create_product()
    size = create_size()
    product_size_quantity = create_product_size_quantity(product, size)
    cart = create_cart(user, product_size_quantity)

    resp = client.put(
        f"{prefix}/{cart.id}",
        headers=get_jwt_header(user),
        json={"id": str(cart.id), "quantity": "2"},
    )
    data = resp.json()
    assert data["message"] == "Cart updated"
    assert resp.status_code == 200


def test_delete_cart(
    client: TestClient,
    create_user,
    create_cart,
    create_product,
    create_size,
    create_product_size_quantity,
):
    user = create_user()
    product = create_product()
    size = create_size()
    product_size_quantity = create_product_size_quantity(product, size)
    cart = create_cart(user, product_size_quantity)

    resp = client.delete(
        f"{prefix}/{cart.id}",
        headers=get_jwt_header(user),
        params={
            "id": str(cart.id),
        },
    )
    data = resp.json()
    assert data["message"] == "Cart deleted"
    assert resp.status_code == 200


def test_clear_cart(client: TestClient, create_user):
    user = create_user()

    resp = client.delete(
        f"{prefix}/clear",
        headers=get_jwt_header(user),
    )
    data = resp.json()
    assert data["message"] == "Cart cleared"
    assert resp.status_code == 200
