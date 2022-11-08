from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.user import User
from app.schemas.order import CreateOrder, GetAdminOrders, GetUserOrders
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("/order", response_model=GetUserOrders, status_code=status.HTTP_200_OK)
def get_orders_user(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    orders = session.execute(
        f"""
        select id, created_at, shipping_method, shipping_price, status, shipping_address, city, array_agg(product) products
        from (
            SELECT DISTINCT ON (products.id) orders.id, orders.city, orders.created_at,
            orders.shipping_method, orders.shipping_price, orders.status, orders.address as shipping_address,
            json_build_object(
                'id', products.id,
                'details', array_agg(
                        json_build_object(
                            'quantity', order_items.quantity,
                            'size', sizes.size
                    )
                ),
                'price', products.price,
                'name', products.title,
                'image', CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))
            ) product
            FROM only orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN sizes ON product_size_quantities.size_id = sizes.id
            JOIN products ON product_size_quantities.product_id = products.id
            JOIN product_images ON products.id = product_images.product_id
            JOIN images ON product_images.image_id = images.id
            WHERE orders.user_id = :user_id
            GROUP BY orders.id, products.id, images.id
        ) order_product
        group by order_product.id, order_product.created_at, order_product.shipping_method,
        order_product.shipping_price, order_product.city, order_product.status, order_product.shipping_address

    """,
        {"user_id": current_user.id},
    ).fetchall()

    if not orders:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have no orders",
        )

    return GetUserOrders(data=orders)


@router.post("/order", status_code=status.HTTP_201_CREATED)
def create_order(
    request: CreateOrder,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    cart = session.execute(
        """
        SELECT product_size_quantities.id, product_size_quantities.quantity as stock,
        carts.quantity, products.price, products.title
        FROM carts
        JOIN product_size_quantities ON carts.product_size_quantity_id = product_size_quantities.id
        JOIN products ON product_size_quantities.product_id = products.id
        WHERE user_id = :user_id
    """,
        {"user_id": current_user.id},
    ).fetchall()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart is empty",
        )

    #  Regular:
    #  If total price of items < 200k: Shipping price is 15% of the total price of items purchased
    #  If total price of items >= 200k: Shipping price is 20% of the total price of items purchased
    #  Next Day:
    #  If total price of items < 300k: Shipping price is 20% of the total price of items purchased
    #  If total price of items >= 300k: Shipping price is 25% of the total price of items purchased
    total_price = sum([item.price * item.quantity for item in cart])
    if request.shipping_method == "regular":
        shipping_price = int(
            total_price * 0.15 if total_price < 200000 else total_price * 0.2
        )
    else:
        shipping_price = int(
            total_price * 0.2 if total_price < 300000 else total_price * 0.25
        )

    if total_price + shipping_price > current_user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough balance, you need {total_price + shipping_price - current_user.balance} more",
        )

    try:
        order = Order(
            user_id=current_user.id,
            address_name=request.shipping_address.address_name,
            address=request.shipping_address.address,
            city=request.shipping_address.city,
            shipping_method=request.shipping_method,
            shipping_price=shipping_price,
        )
        session.add(order)
        session.commit()
        logger.info(f"User {current_user.name} created order {order.id}")
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, when creating order",
        )

    for item in cart:
        if item.quantity > item.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item.title} is out of stock, please remove it from cart",
            )
        OrderItem(
            order_id=order.id,
            product_size_quantity_id=item.id,
            quantity=item.quantity,
        )
        session.add(order)
        session.commit()
        logger.info(
            f"User {current_user.name} added product {item.title} to order {order.id}"
        )

        product_size_quantity = session.query(ProductSizeQuantity).get(item.id)
        product_size_quantity.quantity -= item.quantity
        logger.info(
            f"Stock of product {item.title} updated to {product_size_quantity.quantity}"
        )
        session.commit()

    return DefaultResponse(message="Order created successfully")


@router.put(
    "/order/{order_id}", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def update_order_status(
    order_id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    order = (
        session.query(Order)
        .filter(Order.id == order_id)
        .filter(Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order does not exist",
        )

    if order.status != "shipped":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order status is not shipped",
        )

    order.status = "completed"
    session.commit()

    return DefaultResponse(message="Order status updated")


@router.put("/orders/{id}", status_code=status.HTTP_200_OK)
def update_orders(
    id: UUID,
    status: str = Query(regex="^(processed|shipped|cancelled|completed)$"),
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    order = session.execute(
        """
        SELECT status FROM only orders
        WHERE id = :id
        """,
        {"id": id},
    ).fetchone()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    session.execute(
        """
        UPDATE orders
        SET status = :status
        WHERE id = :id
        """,
        {"id": id, "status": status},
    )

    session.commit()
    logger.info(f"Order {id} updated by {current_user.email}")

    return DefaultResponse(message="Order updated")


@router.get("/orders", status_code=status.HTTP_200_OK)
def get_orders_admin(
    sort_by: str = Query("Price a_z", regex="^(Price a_z|Price z_a)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    sort = "ASC" if sort_by == "Price a_z" else "DESC"
    orders = session.execute(
        f"""
        SELECT id, title, sizes, created_at, product_detail,
        email, images_url, user_id, total
        FROM (
            SELECT DISTINCT ON (products.id) orders.id, products.title,
            array_agg( DISTINCT sizes.size) sizes, orders.created_at,
            products.product_detail, users.email, array_agg( DISTINCT images.image_url) images_url,
            orders.user_id, SUM(products.price) total
            FROM only orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN sizes ON product_size_quantities.size_id = sizes.id
            JOIN products ON product_size_quantities.product_id = products.id
            JOIN product_images ON products.id = product_images.product_id
            JOIN images ON product_images.image_id = images.id
            JOIN users ON orders.user_id = users.id
            GROUP BY orders.id, products.id, users.id
        ) order_product
        GROUP BY order_product.id, order_product.title, order_product.created_at, order_product.product_detail,
        order_product.email, order_product.user_id, order_product.total, sizes, images_url
        ORDER BY total {sort}
        LIMIT :page_size OFFSET :offset
    """,
        {"page_size": page_size, "offset": (page - 1) * page_size},
    ).fetchall()

    if not orders:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No orders found",
        )

    return GetAdminOrders(data=orders)
