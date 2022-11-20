import math
from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.deps.send_email import send_checkout_email
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product_size_quantity import ProductSizeQuantity
from app.models.user import User
from app.schemas.default_model import DefaultResponse, Pagination
from app.schemas.order import CreateOrder, GetAdminOrders, GetDetailOrder, GetUserOrders

router = APIRouter()


@router.get("/order", response_model=GetUserOrders, status_code=status.HTTP_200_OK)
def get_orders_user(
    session: Generator = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    orders = session.execute(
        f"""
        SELECT id, created_at, shipping_method, shipping_price, status, shipping_address, city, array_agg(product) products,
        COUNT(*) OVER() totalrow_count
        FROM (
            SELECT  orders.id, orders.city, orders.created_at,
            orders.shipping_method, orders.shipping_price, orders.status, orders.address as shipping_address,
            json_build_object(
                'id', products.id,
                'details', array_agg(
                        json_build_object(
                            'quantity', order_items.quantity,
                            'size', sizes.size
                    )
                ),
                'price', order_items.price,
                'name', products.title,
                'image', CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))
            ) product
            FROM only orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN sizes ON product_size_quantities.size_id = sizes.id
            JOIN products ON product_size_quantities.product_id = products.id
            LEFT JOIN product_images ON products.id = product_images.product_id
            AND product_images.id = (
                SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
            )
            JOIN images ON images.id = product_images.image_id
            WHERE orders.user_id = :user_id
            GROUP BY orders.id, products.id, images.id, order_items.price
        ) order_product
        group by order_product.id, order_product.created_at, order_product.shipping_method,
        order_product.shipping_price, order_product.city, order_product.status, order_product.shipping_address
        ORDER BY order_product.created_at DESC
        OFFSET :offset LIMIT :limit
    """,
        {
            "user_id": current_user.id,
            "offset": (page - 1) * page_size,
            "limit": page_size,
        },
    ).fetchall()

    if not orders:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have no orders",
        )

    return GetUserOrders(
        data=orders,
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_item=orders[0].totalrow_count if orders else 0,
            total_page=math.ceil(orders[0].totalrow_count / page_size) if orders else 1,
        ),
    )


@router.get(
    "/orders/{id}", response_model=GetDetailOrder, status_code=status.HTTP_200_OK
)
def get_order_details(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    order = session.execute(
        """
        SELECT id, created_at, shipping_method, shipping_price, status, shipping_address, city,
        array_agg(product) products, name, email
        FROM (
            SELECT  orders.id, orders.city, orders.created_at, users.name, users.email,
            orders.shipping_method, orders.shipping_price, orders.status, orders.address as shipping_address,
            json_build_object(
                'id', products.id,
                'details', array_agg(
                        json_build_object(
                            'quantity', order_items.quantity,
                            'size', sizes.size
                    )
                ),
                'price', order_items.price,
                'name', products.title,
                'image', CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(images.image_url, 'image-not-available.webp'))
            ) product
            FROM only orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
            JOIN sizes ON product_size_quantities.size_id = sizes.id
            JOIN products ON product_size_quantities.product_id = products.id
            LEFT JOIN product_images ON products.id = product_images.product_id
            AND product_images.id = (
                SELECT id FROM product_images WHERE product_id = products.id LIMIT 1
            )
            JOIN images ON images.id = product_images.image_id
            JOIN users ON orders.user_id = users.id
            WHERE orders.id = :id
            GROUP BY orders.id, products.id, images.id, users.name, users.email, order_items.price
        ) order_product
        group by order_product.id, order_product.created_at, order_product.shipping_method,
        order_product.shipping_price, order_product.status, order_product.shipping_address,
        order_product.city, order_product.name, order_product.email
        """,
        {
            "id": id,
        },
    ).fetchone()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    return order


@router.get("/orders", response_model=GetAdminOrders, status_code=status.HTTP_200_OK)
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
            orders.user_id, SUM(order) total
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


@router.post("/order", status_code=status.HTTP_201_CREATED)
async def create_order(
    request: CreateOrder,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if request.shipping_address.address_name == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Address name is empty",
        )

    if request.shipping_address.address == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Address is empty",
        )

    if request.shipping_address.city == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City is empty",
        )

    if request.shipping_address.phone_number == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is empty",
        )

    cart = session.execute(
        """
        SELECT product_size_quantities.id, product_size_quantities.quantity as stock,
        carts.quantity, products.title, products.brand, products.condition, products.price, sizes.size
        FROM only carts
        JOIN product_size_quantities ON carts.product_size_quantity_id = product_size_quantities.id
        JOIN sizes ON product_size_quantities.size_id = sizes.id
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
    if request.shipping_method == "Regular":
        shipping_price = int(
            total_price * 0.15 if total_price < 200000 else total_price * 0.2
        )
    else:
        shipping_price = int(
            total_price * 0.2 if total_price < 300000 else total_price * 0.25
        )
    logger.info(f"Shipping price: {shipping_price}")
    logger.info(f"Total price: {total_price}")
    if total_price + shipping_price > current_user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough balance, you need {total_price + shipping_price - current_user.balance} more",
        )

    # create order
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

    # create order items
    for item in cart:
        if item.quantity > item.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item.title} is out of stock, please remove it from cart",
            )
        order_item = OrderItem(
            order_id=order.id,
            product_size_quantity_id=item.id,
            quantity=item.quantity,
            price=item.price,
        )
        session.add(order_item)
        session.commit()
        logger.info(
            f"User {current_user.name} added {item.quantity} of product {item.title} to order {order.id}"
        )

        product_size_quantity = session.query(ProductSizeQuantity).get(item.id)
        product_size_quantity.quantity -= item.quantity
        logger.info(
            f"Stock of product {item.title} updated to {product_size_quantity.quantity}"
        )
        session.commit()

    # clear cart
    try:
        session.execute(
            """
            DELETE FROM only carts
            WHERE user_id = :user_id
        """,
            {"user_id": current_user.id},
        )
        session.commit()
        logger.info(f"User {current_user.name} cleared cart")
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, when clearing cart",
        )

    # reduce balance
    try:
        user = session.query(User).get(current_user.id)
        user.balance -= total_price + shipping_price
        session.commit()
        logger.info(f"User {current_user.name} reduced balance to {user.balance}")
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, when reducing balance",
        )
    if request.send_email:
        await send_checkout_email(
            email=current_user.email,
            name=current_user.name,
            shipping_address=request.shipping_address.address,
            shipping_method=request.shipping_method,
            shipping_price=shipping_price,
            subtotal=total_price,
            total=total_price + shipping_price,
            order_items=cart,
        )
        return DefaultResponse(
            message="Order created successfully And An Email Has Been Sent To You"
        )
    else:
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
