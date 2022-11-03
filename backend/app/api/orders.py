from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.order import GetUserOrders
from app.schemas.request_params import DefaultResponse

router = APIRouter()


@router.get("/order", response_model=GetUserOrders, status_code=status.HTTP_200_OK)
def get_orders_user(
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):

    orders = session.execute(
        """
        select id, created_at, shipping_method, status, shipping_address, array_agg(product) products
        from (
            SELECT DISTINCT ON (products.id) orders.id, orders.created_at,
            orders.shipping_method, orders.status, orders.address as shipping_address,
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
                'image', images.image_url
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
        order_product.status, order_product.shipping_address

    """,
        {"user_id": current_user.id},
    ).fetchall()

    return GetUserOrders(data=orders)


@router.put("/orders/{id}", status_code=status.HTTP_200_OK)
def update_order(
    id: UUID,
    status: str = Query(regex="^(pending|delivered|cancelled|finished)$"),
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    order = session.execute(
        """
        SELECT * FROM only orders
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

    return {"message": "Order updated successfully"}


# @router.get("/orders", status_code=status.HTTP_200_OK)
# def get_orders_admin(
#     request: RequestOrders = Depends(RequestOrders),
#     session: Generator = Depends(get_db),
#     current_user: User = Depends(get_current_active_admin),
# ):
#     sort = "ASC" if request.sort_by == "Price a_z" else "DESC"
#     orders = session.execute(
#         f"""
#         select id, created_at, shipping_method, status, shipping_address, user_id, array_agg(product) products
#         from (
#             SELECT orders.id, orders.created_at, orders.shipping_method, orders.status,
#                   orders.address as shipping_address, orders.user_id,
#             json_build_object(
#                 'id', products.id,
#                 'details', array_agg(
#                         json_build_object(
#                             'quantity', order_items.quantity,
#                             'size', sizes.size
#                     )
#                 ),
#                 'price', products.price,
#                 'name', products.title
#             ) product
#             FROM only orders
#             JOIN order_items ON orders.id = order_items.order_id
#             JOIN product_size_quantities ON order_items.product_size_quantity_id = product_size_quantities.id
#             JOIN sizes ON product_size_quantities.size_id = sizes.id
#             JOIN products ON product_size_quantities.product_id = products.id
#             GROUP BY orders.id, products.id
#         ) order_product
#         group by order_product.id, order_product.created_at, order_product.shipping_method, order_product.status,
#           order_product.shipping_address, order_product.user_id
#         ORDER BY order_product.products.price {sort}
#         OFFSET :offset
#         LIMIT :limit
#         """,
#         {"offset": (request.page - 1) * request.page_size, "limit": request.page_size},
#     ).fetchall()

#     return GetUserOrders(data=orders)
