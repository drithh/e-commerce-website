import uuid
from datetime import datetime, timedelta

import pytz
from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_async_session
from app.deps.email import send_forgot_password_email
from app.models.forgot_password import ForgotPassword
from app.models.user import User
from app.schemas.authentication import (
    ChangePassword,
    PostForgotPassword,
    ResetPassword,
    TokenData,
)
from app.schemas.authentication import User as UserSchema
from app.schemas.authentication import UserCreate, UserRead

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PATH}/sign-in")


@router.post("/sign-in", response_model=UserRead, status_code=status.HTTP_200_OK)
async def sign_in(
    request: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session),
):
    user = (
        await session.execute(select(User).filter(User.email == request.username))
    ).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not User.verify_password(request.password, user.User):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.User.email})
    user = UserSchema(
        name=user.User.name,
        email=user.User.email,
        phone_number=user.User.phone_number,
        type="seller" if user.User.is_admin else "buyer",
    )
    return UserRead(
        user_information=user,
        access_token=access_token,
        token_type="bearer",
        message="Login success",
    )


@router.post("/sign-up", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def sign_up(
    request: UserCreate,
    session: AsyncSession = Depends(get_async_session),
):
    email_validation(request.email)
    password_validation(request.password)
    user = (
        await session.execute(select(User).filter(User.email == request.email))
    ).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
            headers={"WWW-Authenticate": "Bearer"},
        )

    hashed_password, salt = User.encrypt_password(request.password)

    new_user = User(
        name=request.name,
        email=request.email,
        phone_number=request.phone_number,
        salt=salt,
        password=hashed_password,
    )
    session.add(new_user)
    await session.commit()

    access_token = create_access_token(data={"sub": request.email})

    user = UserSchema(
        name=request.name,
        email=request.email,
        phone_number=request.phone_number,
        type="buyer",
    )
    logger.info(f"User {user.email} signed up")
    return UserRead(
        user_information=user,
        access_token=access_token,
        token_type="bearer",
        message="success, user created",
    )


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
    response_model=PostForgotPassword,
)
async def forgot_password(
    email: str,
    session: AsyncSession = Depends(get_async_session),
):
    user = (await session.execute(select(User).filter(User.email == email))).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not registered",
            headers={"WWW-Authenticate": "Bearer"},
        )
    reset_token = str(uuid.uuid4())

    # remove old token
    await session.execute(
        delete(ForgotPassword).filter(ForgotPassword.user_id == user.User.id)
    )
    send_forgot_password_email

    forgot_password = ForgotPassword(
        user_id=user.User.id,
        token=reset_token,
        expired_at=datetime.now() + timedelta(hours=1),
    )
    session.add(forgot_password)
    await session.commit()
    await send_forgot_password_email(email, reset_token)
    return PostForgotPassword(
        detail="Reset password link sent to your email",
    )


@router.put("/reset-password/{token}", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ResetPassword,
    session: AsyncSession = Depends(get_async_session),
):
    password_validation(request.password)
    forgot_password = (
        await session.execute(
            select(ForgotPassword).filter(ForgotPassword.token == request.token)
        )
    ).first()
    if not forgot_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if forgot_password.ForgotPassword.expired_at < datetime.now(tz=pytz.UTC):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    #  remove old token
    await session.execute(
        delete(ForgotPassword).filter(ForgotPassword.token == request.token)
    )

    # update password
    user = (
        await session.execute(
            select(User).filter(User.id == forgot_password.ForgotPassword.user_id)
        )
    ).first()
    hashed_password, salt = User.encrypt_password(request.password)
    user.User.password = hashed_password
    user.User.salt = salt
    await session.commit()
    return {"detail": "Password reset success"}


async def get_current_active_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = (
        await session.execute(select(User).filter(User.email == token_data.email))
    ).first()
    if user is None:
        raise credentials_exception
    return user


@router.put("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    request: ChangePassword,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user),
):
    password_validation(request.new_password)

    if not User.verify_password(request.old_password, current_user.User):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    hashed_password, salt = User.encrypt_password(request.new_password)
    current_user.User.password = hashed_password
    current_user.User.salt = salt
    await session.commit()
    return {"detail": "Password changed success"}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


async def get_current_active_admin(
    session: AsyncSession = Depends(get_async_session),
    token: str = Depends(oauth2_scheme),
):
    user = await get_current_active_user(token=token, session=session)
    if not user.User.is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    return user


def email_validation(email: str):
    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is not valid",
        )


def password_validation(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )
    if password.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number",
        )
    if password.isnumeric():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one letter",
        )
    if password.isalnum():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character",
        )
    if password.islower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter",
        )
    if password.isupper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter",
        )
