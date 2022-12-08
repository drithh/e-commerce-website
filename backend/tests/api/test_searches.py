from starlette.testclient import TestClient

import uuid

from app.core.config import settings
from tests.utils import get_jwt_header
from sqlalchemy.orm.session import Session
from app.deps.google_cloud import delete_image
from app.deps.image_base64 import base64_to_image

prefix = f"{settings.API_PATH}"


def test_get_iamge(
    client: TestClient,
    create_user,
    db: Session,
):
    user = create_user()
    db.execute(
        """
        INSERT INTO images (name, image_url)
        VALUES (:name, :image_url)
    """,
        {"name": "test", "image_url": "test"},
    )
    db.commit()
    resp = client.get(
        f"{prefix}/image", headers=get_jwt_header(user), params={"image_name": "test"}
    )
    assert resp.status_code == 200
    assert resp.json()


def test_get_image_not_found(
    client: TestClient,
    create_user,
    db: Session,
):
    user = create_user()
    resp = client.get(
        f"{prefix}/image", headers=get_jwt_header(user), params={"image_name": "test"}
    )
    assert resp.status_code == 404
    assert resp.json() == {"message": "Image not found"}


def test_search_text(
    client: TestClient,
    create_user,
    create_product,
    db: Session,
):
    user = create_user()
    product = create_product()
    db.execute(
        """
        CREATE EXTENSION IF NOT EXISTS "pg_trgm";

        CREATE OR REPLACE FUNCTION search_products(term TEXT)
        returns table(
        id UUID,
        title TEXT
        )
        as
        $$

        SELECT p.id, p.title
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE term <% (p.title || ' ' || p.brand || ' ' || SPLIT_PART(c.title, '-', 1) || ' ' || SPLIT_PART(c.title, '-', 2))
        ORDER BY term <<-> (p.title || ' ' || p.brand || ' ' || SPLIT_PART(c.title, '-', 1) || ' ' || SPLIT_PART(c.title, '-', 2)) LIMIT 10;
        $$ language SQL;

    """
    )
    db.commit()
    resp = client.get(
        f"{prefix}/search",
        headers=get_jwt_header(user),
        params={"text": "product_title"},
    )
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "id": str(product.id),
            "title": product.title,
        }
    ]


def test_search_image(
    client: TestClient,
    create_user,
    get_base64_image,
    db: Session,
):
    user = create_user()
    db.execute(
        """
        INSERT INTO categories (title, type)
        VALUES (:title, :type)
    """,
        {"title": "bags", "type": "bag"},
    )
    db.commit()
    category = db.execute(
        """
        SELECT * FROM categories
    """
    ).fetchone()

    resp = client.post(
        f"{prefix}/search_image",
        headers=get_jwt_header(user),
        json={"base64_image": get_base64_image()},
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == str(category.id)


def test_wrong_search_image(
    client: TestClient,
    create_user,
):
    user = create_user()
    resp = client.post(
        f"{prefix}/search_image",
        headers=get_jwt_header(user),
        json={"base64_image": "wrong_image"},
    )
    assert resp.status_code == 400
    assert resp.json() == {"message": "Image is not base64"}


def test_shower_thoughts(
    client: TestClient,
    create_user,
    db: Session,
):
    user = create_user()
    resp = client.get(
        f"{prefix}/shower-thoughts",
        headers=get_jwt_header(user),
    )
    assert resp.status_code == 200
    assert resp.json()["data"].__len__() > 1
