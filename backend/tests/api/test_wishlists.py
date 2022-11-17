from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/wishlist"


def test_get_empty_wishlist(client: TestClient, create_admin):
    user = create_admin()

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    assert resp.json()["data"] == []


def test_get_wishlist(client: TestClient, create_admin, create_wishlist):
    user = create_admin()
    wishlist = create_wishlist(user)

    resp = client.get(f"{prefix}", headers=get_jwt_header(user))
    assert resp.status_code == 200
    data = resp.json()
    assert data["data"][0]["id"] == str(wishlist.id)


def test_create_wishlist(client: TestClient, create_admin, create_product):
    user = create_admin()
    product = create_product()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(user),
        params={
            "id": str(product.id),
        },
    )
    data = resp.json()
    assert data["message"] == "Wishlist Created"
    assert resp.status_code == 201


def test_delete_wishlist(
    client: TestClient, create_admin, create_wishlist, create_product
):
    user = create_admin()
    product = create_product()
    wishlist = create_wishlist(user, product)

    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(user),
        params={
            "id": str(wishlist.id),
        },
    )
    data = resp.json()
    assert data["message"] == "Wishlist deleted"
    assert resp.status_code == 200


def test_clear_wishlist(
    client: TestClient, create_admin, create_wishlist, create_product
):
    user = create_admin()
    product = create_product()
    create_wishlist(user, product)

    resp = client.delete(
        f"{prefix}/all",
        headers=get_jwt_header(user),
    )
    data = resp.json()
    assert data["message"] == "Wishlist cleared"
    assert resp.status_code == 200
