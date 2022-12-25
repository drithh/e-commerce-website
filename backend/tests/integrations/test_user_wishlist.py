from starlette.testclient import TestClient

from app.core.config import settings

prefix = f"{settings.API_PATH}/admin"


def test_user_wishlist(client: TestClient, create_user, create_product):
    user = create_user()
    product_1 = create_product()
    product_2 = create_product()

    # user login
    sign_in = client.post(
        f"{settings.API_PATH}/sign-in",
        data={"username": user.email, "password": "password"},
    )
    assert sign_in.status_code == 200
    assert sign_in.json().get("access_token")

    authorization = {"Authorization": f"Bearer {sign_in.json().get('access_token')}"}

    # add product 1 to wishlist
    create_wishlist = client.post(
        f"{settings.API_PATH}/wishlist",
        headers=authorization,
        params={"id": product_1.id},
    )
    assert create_wishlist.status_code == 201
    assert create_wishlist.json().get("message") == "Wishlist Created"

    # add product 2 to wishlist
    create_wishlist = client.post(
        f"{settings.API_PATH}/wishlist",
        headers=authorization,
        params={"id": product_2.id},
    )
    assert create_wishlist.status_code == 201
    assert create_wishlist.json().get("message") == "Wishlist Created"

    # get wishlist
    get_wishlist = client.get(f"{settings.API_PATH}/wishlist", headers=authorization)
    assert get_wishlist.status_code == 200
    assert get_wishlist.json().get("data")[0].get("product_id") == str(product_1.id)
    assert get_wishlist.json().get("data")[1].get("product_id") == str(product_2.id)

    # delete product 1 from wishlist
    delete_wishlist = client.delete(
        f"{settings.API_PATH}/wishlist",
        headers=authorization,
        params={"id": product_1.id},
    )
    assert delete_wishlist.status_code == 200
    assert delete_wishlist.json().get("message") == "Wishlist deleted"

    # clear wishlist
    clear_wishlist = client.delete(
        f"{settings.API_PATH}/wishlist/all", headers=authorization
    )
    assert clear_wishlist.status_code == 200
    assert clear_wishlist.json().get("message") == "Wishlist cleared"

    # get wishlist
    get_wishlist = client.get(f"{settings.API_PATH}/wishlist", headers=authorization)
    assert get_wishlist.status_code == 200
