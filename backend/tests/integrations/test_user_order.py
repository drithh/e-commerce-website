from asyncio import sleep
from starlette.testclient import TestClient

from app.core.config import settings


def test_user_order(
    client: TestClient,
    create_user,
    create_product,
    create_product_size_quantity,
    create_size,
):
    user = create_user()
    size = create_size(size_model="L")
    product_1 = create_product()
    product_size_quantity1 = create_product_size_quantity(product=product_1, size=size)
    product_2 = create_product()
    product_size_quantity2 = create_product_size_quantity(product=product_2, size=size)

    # user login
    sign_in = client.post(
        f"{settings.API_PATH}/sign-in",
        data={"username": user.email, "password": "password"},
    )
    assert sign_in.status_code == 200
    assert sign_in.json().get("access_token")

    authorization = {"Authorization": f"Bearer {sign_in.json().get('access_token')}"}

    # get all products
    get_products = client.get(f"{settings.API_PATH}/products", headers=authorization)
    assert get_products.status_code == 200
    assert len(get_products.json().get("data")) == 2

    # get detail product
    get_detail_product = client.get(
        f"{settings.API_PATH}/products/{product_1.id}", headers=authorization
    )
    assert get_detail_product.status_code == 200
    assert get_detail_product.json().get("id") == str(product_1.id)

    # add product to cart
    create_cart = client.post(
        f"{settings.API_PATH}/cart",
        headers=authorization,
        json={
            "product_id": str(product_1.id),
            "quantity": 1,
            "size": "L",
        },
    )
    assert create_cart.status_code == 201
    assert create_cart.json().get("message") == "Added to cart"

    # get cart
    get_cart = client.get(f"{settings.API_PATH}/cart", headers=authorization)
    assert get_cart.status_code == 200
    product1_id = get_cart.json().get("data")[0].get("id")

    # update cart product 1
    update_cart = client.put(
        f"{settings.API_PATH}/cart",
        headers=authorization,
        json={
            "id": product1_id,
            "quantity": 2,
        },
    )
    assert update_cart.json().get("message") == "Cart updated"
    assert update_cart.status_code == 200

    # get detail product 2
    get_detail_product = client.get(
        f"{settings.API_PATH}/products/{product_2.id}", headers=authorization
    )
    assert get_detail_product.status_code == 200
    assert get_detail_product.json().get("id") == str(product_2.id)

    # add product 2 to cart
    create_cart = client.post(
        f"{settings.API_PATH}/cart",
        headers=authorization,
        json={
            "product_id": str(product_2.id),
            "quantity": 1,
            "size": "L",
        },
    )
    assert create_cart.status_code == 201
    assert create_cart.json().get("message") == "Added to cart"

    # delete cart product 2
    delete_cart = client.delete(
        f"{settings.API_PATH}/cart", headers=authorization, params={"id": product1_id}
    )
    assert delete_cart.status_code == 200
    assert delete_cart.json().get("message") == "Cart deleted"

    # update balance
    update_balance = client.post(
        f"{settings.API_PATH}/user/balance",
        headers=authorization,
        json={"balance": 1000000},
    )
    assert update_balance.status_code == 201
    assert update_balance.json().get("message").startswith("Your balance")

    # checkout
    checkout = client.post(
        f"{settings.API_PATH}/order",
        headers=authorization,
        json={
            "shipping_method": "Regular",
            "shipping_address": {
                "address_name": "Jl. Kebon Jeruk",
                "address": "Jl. Kebon Jeruk No. 1",
                "city": "Jakarta Barat",
                "phone_number": "082112345678",
            },
            "send_email": False,
        },
    )

    assert checkout.status_code == 201
    assert checkout.json().get("message") == "Order created successfully"
