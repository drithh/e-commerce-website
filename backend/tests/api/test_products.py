import uuid

from sqlalchemy.orm.session import Session
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


def test_get_newest_products(client: TestClient, db: Session, create_category):
    category = create_category()
    db.execute(
        """INSERT INTO products (title, brand, product_detail, price, category_id, condition, created_at) VALUES
        ('product1', 'product1', 'product1', 10000, :category_id, 'new', '2022-11-02 16:36:56.324' )""",
        {"""category_id""": category.id},
    )
    db.execute(
        """INSERT INTO products (title, brand, product_detail, price, category_id, condition, created_at) VALUES
        ('product2', 'product2', 'product2', 10000, :category_id, 'new', '2022-11-03 16:36:56.324' )""",
        {"""category_id""": category.id},
    )

    db.commit()

    resp = client.get(
        f"{prefix}",
        params={"sort_by": "Newest"},
    )

    assert resp.json()["data"][0]["title"] == "product2"
    assert resp.status_code == 200


def test_get_oldest_products(client: TestClient, db: Session, create_category):
    category = create_category()
    db.execute(
        """
            INSERT INTO products (title, brand, product_detail, price, category_id, condition, created_at) VALUES
            ('product1', 'product1', 'product1', 10000, :category_id, 'new', '2022-11-02 16:36:56.324' )
        """,
        {"""category_id""": category.id},
    )
    db.execute(
        """
            INSERT INTO products (title, brand, product_detail, price, category_id, condition, created_at) VALUES
            ('product2', 'product2', 'product2', 10000, :category_id, 'new', '2022-11-03 16:36:56.324' )
        """,
        {"""category_id""": category.id},
    )
    db.commit()

    resp = client.get(
        f"{prefix}",
        params={"sort_by": "Oldest"},
    )

    assert resp.json()["data"][0]["title"] == "product1"
    assert resp.status_code == 200


def test_get_products_with_category_id(client: TestClient, create_product):
    product = create_product()
    category_id = product.category_id

    resp = client.get(f"{prefix}", params={"category": [str(category_id)]})
    assert resp.status_code == 200
    assert resp.json()["data"][0]["id"] == str(product.id)


def test_products_with_name_price_condition(
    client: TestClient, db: Session, create_category
):
    category = create_category()
    db.execute(
        """
            INSERT INTO products (title, brand, product_detail, price, category_id, condition) VALUES
            ('product1', 'product1', 'product1', 10000, :category_id, 'new' )
        """,
        {"category_id": category.id},
    )
    db.commit()

    resp = client.get(
        f"{prefix}",
        params={"product_name": "product1", "price": [5000, 20000], "condition": "new"},
    )
    assert resp.status_code == 200
    assert resp.json()["data"][0]["title"] == "product1"


def test_products_with_page_limit(client: TestClient, create_product):
    create_product()
    create_product()

    resp = client.get(f"{prefix}", params={"page": 1, "page_size": 5})
    assert resp.status_code == 200
    assert len(resp.json()["data"]) == 2


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


def test_create_product_invalid_size(client: TestClient, create_admin, create_category):
    admin = create_admin()
    category = create_category()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "title": "hehe",
            "brand": "hoho",
            "product_detail": "haha",
            "images": [],
            "price": 10000,
            "condition": "new",
            "category_id": str(category.id),
            "stock": [{"size": "XXL", "quantity": 100}],
        },
    )
    assert resp.status_code == 400
    assert resp.json() == {"message": "Size does not exist"}


def test_create_product(client: TestClient, create_category, create_admin, create_size, get_base64_image):

    category = create_category()
    admin = create_admin()
    size = create_size(size_model="S")
    test_image = get_base64_image()

    # assert test_image == ""
    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "title": "hehe",
            "brand": "hoho",
            "product_detail": "haha",
            "images": [test_image],
            "price": 10000,
            "condition": "new",
            "category_id": str(category.id),
            "stock": [{"size": size.size, "quantity": 100}],
        },
    )
    assert resp.json()["message"] == "Product added"
    assert resp.status_code == 201


def test_create_product_wrong_category(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.post(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "title": "hehe",
            "brand": "hoho",
            "product_detail": "haha",
            "images": [],
            "price": 10000,
            "condition": "new",
            "category_id": str(uuid.uuid4()),
            "stock": [{"size": "S", "quantity": 100}],
        },
    )
    assert resp.status_code == 400
    assert resp.json()["message"].startswith("IntegrityError")


def test_update_product_false_category_id(
    client: TestClient, create_product, create_admin
):
    product = create_product()
    admin = create_admin()

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "id": str(product.id),
            "title": "hehe",
            "brand": "hoho",
            "product_detail": "haha",
            "images": [],
            "price": 10000,
            "condition": "new",
            "category_id": str(uuid.uuid4()),
            "stock": [{"size": "S", "quantity": 100}],
        },
    )
    assert resp.json()["message"].startswith("IntegrityError")
    assert resp.status_code == 400


def test_update_product_unavailable_size(
    client: TestClient, create_product, create_admin, db: Session
):
    product = create_product()
    admin = create_admin()

    db.execute(
        """
            INSERT INTO sizes (size) VALUES ('S')
        """
    )
    db.commit()

    size = db.execute("SELECT * FROM sizes").fetchone()

    db.execute(
        """
            INSERT INTO product_size_quantities (product_id, size_id, quantity) VALUES (:product_id, :size_id, 10)
        """,
        {"product_id": product.id, "size_id": size.id},
    )
    db.commit()

    resp = client.put(
        f"{prefix}",
        headers=get_jwt_header(admin),
        json={
            "id": str(product.id),
            "title": "hehe",
            "brand": "hoho",
            "product_detail": "haha",
            "images": [],
            "price": 10000,
            "condition": "new",
            "category_id": str(product.category_id),
            "stock": [{"size": "XXL", "quantity": 10}],
        },
    )
    assert resp.json()["message"] == "Size does not exist"
    assert resp.status_code == 400


def test_update_product_not_admin(client: TestClient):

    resp = client.put(f"{prefix}")
    assert resp.json() == {"message": "Not authenticated"}
    assert resp.status_code == 401


def test_update_product(
    client: TestClient,
    create_product,
    create_admin,
    create_product_size_quantity,
    db: Session,
):
    admin = create_admin()
    product = create_product()

    db.execute("INSERT INTO sizes (size) VALUES ('S')")
    db.commit()
    size = db.execute("SELECT * FROM sizes").fetchone()
    create_product_size_quantity(product, size)

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


def test_delete_product_not_admin(client: TestClient, create_product):
    product = create_product()

    resp = client.delete(f"{prefix}", params={"product_id": str(product.id)})
    assert resp.status_code == 401
    assert resp.json() == {"message": "Not authenticated"}


def test_delete_product_not_found(client: TestClient, create_admin):
    admin = create_admin()

    resp = client.delete(
        f"{prefix}",
        params={"product_id": "df2ecf60-6132-4084-b5c2-9ac686452322"},
        headers=get_jwt_header(admin),
    )
    assert resp.status_code == 404
    assert resp.json() == {"message": "Product not found"}


def test_delete_product(client: TestClient, create_product, create_admin):
    admin = create_admin()
    product = create_product()

    resp = client.delete(
        f"{prefix}",
        params={"product_id": str(product.id)},
        headers=get_jwt_header(admin),
    )
    assert resp.status_code == 200
    assert resp.json() == {"message": "Product deleted"}
