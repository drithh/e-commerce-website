from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}"

def test_admin_create_category(client: TestClient, create_admin, create_category, create_size, get_base64_image):
    admin = create_admin()
    category = create_category()
    size = create_size(size_model="L")
    base64_image = get_base64_image()

    # admin login
    sign_in = client.post(
        f"{settings.API_PATH}/sign-in",
        data={"username": admin.email, "password": "admin"},
    )
    assert sign_in.status_code == 200
    assert sign_in.json().get("access_token")

    authorization = {"Authorization": f"Bearer {sign_in.json().get('access_token')}"}

    # get category
    get_category = client.get(
        f"{prefix}/categories",
        headers=authorization,
    )

    assert get_category.status_code == 200
    assert get_category.json().get("data")[0].get("id") == str(category.id)

    # create product using existing category
    create_product = client.post(
        f"{prefix}/products",
        headers=authorization,
        json={
            "title": "test product",
            "brand": "test brand",
            "product_detail": "test product detail",
            "images" : [base64_image],
            "price": 100,
            "category_id": str(category.id),
            "condition": "new",
            "stock": [
                {
                    "size": "L",
                    "quantity": 2,
                }
            ]
        },
    )
    assert create_product.json().get("message") == "Product added"
    assert create_product.status_code == 201

    # get product
    get_product = client.get(
        f"{prefix}/products",
        headers=authorization,
    )
    assert get_product.status_code == 200
    assert get_product.json().get("data") != []

    product_id = get_product.json().get("data")[0].get("id")

    # get product detail
    get_product_detail = client.get(
        f"{prefix}/products/{str(product_id)}",
        headers=authorization,
    )
    assert get_product_detail.status_code == 200
    assert get_product_detail.json()['id'] == str(product_id)

    # update product
    update_product = client.put(
        f"{prefix}/products",
        headers=authorization,
        json={
            "id": str(product_id),
            "title": "test update product",
            "brand": "test update brand",
            "product_detail": "test product detail",
            "images" : [base64_image],
            "price": 100,
            "category_id": str(category.id),
            "condition": "new",
            "stock": [
                {
                    "size": "L",
                    "quantity": 2,
                }
            ]
        }
    )

    assert update_product.status_code == 200
    assert update_product.json().get("message") == "Product updated"

    get_product = client.get(
        f"{prefix}/products/{str(product_id)}",
        headers=authorization,
    )

    assert get_product.json().get("title") == "test update product"

    # delete product
    delete_product = client.delete(
        f"{prefix}/products",
        headers=authorization,
        params={"product_id": str(product_id)}
    )
    assert delete_product.json().get("message") == "Product deleted"
    assert delete_product.status_code == 200

    