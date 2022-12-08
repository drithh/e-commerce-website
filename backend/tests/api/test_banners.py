from starlette.testclient import TestClient

import uuid

from app.core.config import settings
from tests.utils import get_jwt_header
from app.deps.google_cloud import delete_image
from sqlalchemy.orm.session import Session

prefix = f"{settings.API_PATH}/banners"

def test_get_empty_banners(client: TestClient):
    resp = client.get(f"{prefix}")
    assert resp.status_code == 404
    assert resp.json() == {"message": "There are no banners"}


def test_get_banners(client: TestClient, create_banner):
    banner = create_banner()

    resp = client.get(f"{prefix}")
    assert resp.status_code == 200
    data = resp.json().get("data")
    assert data[0]["id"] == str(banner.id)


def test_get_empty_banner(client: TestClient):
    resp = client.get(f"{prefix}/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404
    assert resp.json() == {"message": "Banner not found"}


def test_get_banner(client: TestClient, create_banner):
    banner = create_banner()

    resp = client.get(f"{prefix}/{banner.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == str(banner.id)


def test_create_banner(client: TestClient, create_admin, get_base64_image):
    admin = create_admin()
    image_data = get_base64_image()

    data = {
        "image": image_data,
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"] == "Banner created successfully"
    assert resp.status_code == 201
    file_name = f"banners/banner-1-1.jpeg"
    delete_image(file_name)


def test_update_banner(
    client: TestClient,
    create_admin,
    create_banner,
    get_base64_image,
):
    admin = create_admin()
    banner = create_banner()
    image_data = get_base64_image()

    data = {
        "id": str(banner.id),
        "image": image_data,
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"] == "Banner updated successfully"
    assert resp.status_code == 200
    file_name = f"banners/banner-1-1.jpeg"
    delete_image(file_name)
    

def test_create_banner_wrong_image(
    client: TestClient,
    create_admin,
):
    admin = create_admin()

    data = {
        "image": "wrong_image",
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"].startswith("Invalid image")
    assert resp.status_code == 400


def test_delete_banner(
    client: TestClient,
    create_admin,
    create_banner,
):
    admin = create_admin()
    banner = create_banner()

    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={"id": str(banner.id)},
    )
    data = resp.json()
    assert data["message"] == "Banner deleted successfully"
    assert resp.status_code == 200


def test_delete_empty_banner(
    client: TestClient,
    create_admin,
):
    admin = create_admin()

    resp = client.delete(
        f"{prefix}",
        headers=get_jwt_header(admin),
        params={"id": str(uuid.uuid4())},
    )
    data = resp.json()
    assert data["message"] == "Banner not found"
    assert resp.status_code == 404


def test_update_banner_wrong_image(
    client: TestClient,
    create_admin,
    create_banner,
):
    admin = create_admin()
    banner = create_banner()

    data = {
        "id": str(banner.id),
        "image": "wrong_image",
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"].startswith("Invalid image")
    assert resp.status_code == 400


def test_update_deleted_image_banner(
    client: TestClient,
    create_admin,
    create_banner,
):
    admin = create_admin()
    banner = create_banner()

    data = {
        "id": str(banner.id),
        "image": "delete",
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"] == "Banner updated successfully"
    assert resp.status_code == 200


def test_update_empty_banner(
    client: TestClient,
    create_admin,
):
    admin = create_admin()

    data = {
        "id": str(uuid.uuid4()),
        "image": "delete",
        "title": "Banner 1",
        "url_path": "/products",
        "text_position": "left"
    }

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"] == "Banner not found"
    assert resp.status_code == 404


def test_create_existed_banner(
    client: TestClient,
    create_image,
    create_admin,
    db: Session,
    get_base64_image,
):
    admin = create_admin()
    image = create_image()
    db.execute(
        """INSERT INTO banners (title, image_id, url_path,text_position) 
        VALUES ('Banner 1', :image_id, 'banner/banner-1-1.jpeg', 'left')""",
        {"image_id": image.id}
    )
    db.commit()
    image_data = get_base64_image()

    data = {
        "image": image_data,
        "title": "Banner 1",
        "url_path": "banner/banner-1-1.jpeg",
        "text_position": "left"
    }

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json=data,
    )
    data = resp.json()
    assert data["message"].startswith("IntegrityError")
    assert resp.status_code == 400
    file_name = f"banners/banner-1-1.jpeg"
    delete_image(file_name)