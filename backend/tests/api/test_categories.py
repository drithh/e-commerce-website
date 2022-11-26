from starlette.testclient import TestClient

from app.core.config import settings
from tests.utils import get_jwt_header

prefix = f"{settings.API_PATH}/categories"


def test_get_empty_category(client: TestClient):
    resp = client.get(f"{prefix}")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no categories"}


def test_get_category(client: TestClient, create_category):
    category = create_category()

    resp = client.get(f"{prefix}")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(category.id)


def test_get_empty_category_detail(client: TestClient):
    resp = client.get(
        f"{prefix}/detail",
        params={
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
    )
    assert resp.status_code == 404
    assert resp.json() == {"message": "Category not found"}


def test_get_category_detail(client: TestClient, create_category):
    category = create_category()

    resp = client.get(
        f"{prefix}/detail",
        params={
            "id": str(category.id),
        },
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == str(category.id)


def test_create_category(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={"title": "title1", "type": "type1"},
    )
    data = resp.json()
    assert data["message"] == "Category added"
    assert resp.status_code == 201


def test_update_category(client: TestClient, create_admin, create_category):
    admin = create_admin()
    category = create_category()

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={
            "id": str(category.id),
        },
        json={"title": "title1", "type": "type1"},
    )
    data = resp.json()
    assert resp.status_code == 200
    assert data["message"] == "Category updated"


def test_delete_category(client: TestClient, create_admin, create_category):
    admin = create_admin()
    category = create_category()

    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={
            "id": str(category.id),
        },
    )
    data = resp.json()
    assert data["message"] == "Category deleted"
    assert resp.status_code == 200
