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


async def send_forgot_password_email(email: str, token: str):
    subject = "Reset your password"
    # body = f"""
    # <!DOCTYPE html>
    # <html>
    #   <Title>Reset your password</Title>
    #   <body>
    #     <p>Hi,{email}</p>
    #     <p>Sombody has requested to reset your password. If it was you, click the link below to reset it.</p>
    #     <a href="http://localhost:8000/{settings.API_PATH}/reset-password?token={token}">Reset your password</a>
    #     <p>If it wasn't you, ignore this email.</p>
    #   </body>
    # </html>
    # """
    template_body = {
        "name": email,
        "action_url": token,
    }
    await send_email(subject, email, template_body)


async def send_email(subject: str, recipientt: str, template_body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[recipientt],
        template_body=template_body,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    await fm.send_message(message, template_name="forgot_password_template.html")
