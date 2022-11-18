from datetime import datetime
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from starlette.responses import JSONResponse

from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS,
    TEMPLATE_FOLDER=Path(__file__).parent / "templates",
)


async def send_forgot_password_email(
    email: str,
    token: str,
):
    subject = "Reset your password"
    template_body = {
        "name": email,
        "action_url": token,
    }
    await send_email(subject, email, template_body, "forgot_password.html")


async def send_checkout_email(
    name: str,
    email: str,
    shipping_address: str,
    shipping_method: str,
    shipping_price: int,
    subtotal: int,
    total: int,
    order_items: list,
):
    order_time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    subject = "Your order has been placed"
    template_body = {
        "name": name,
        "order_time": order_time,
        "shipping_address": shipping_address,
        "subtotal": subtotal,
        "shipping_method": shipping_method,
        "shipping_price": shipping_price,
        "total": total,
        "order_items": order_items,
    }
    await send_email(subject, email, template_body, "checkout_order.html")


async def send_email(
    subject: str,
    recipient: str,
    template_body: dict,
    template_name: str,
):
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        template_body=template_body,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)

    await fm.send_message(message, template_name=template_name)
