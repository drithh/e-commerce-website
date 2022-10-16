from datetime import datetime, timedelta

from fastapi import Depends, status
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

# SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30
from app.core.config import settings
from app.deps.db import get_async_session
from app.models.user import User
from app.schemas.authentication import TokenData
from app.schemas.authentication import User as UserSchema
from app.schemas.authentication import UserCreate, UserDefault, UserRead
from app.schemas.http_exception import HTTPException

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

    return UserRead(user_information=user, token=access_token, message="Login success")


@router.post("/sign-up", status_code=status.HTTP_201_CREATED)
async def sign_up(
    request: UserCreate,
    session: AsyncSession = Depends(get_async_session),
):
    form_validation(request)
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

    insert_statement = """
        INSERT INTO "users" (name, email, phone_number, salt, password)
        VALUES (:name, :email, :phone_number, :salt, :password)
        """
    await session.execute(
        insert_statement,
        params={
            "name": request.name,
            "email": request.email,
            "phone_number": request.phone_number,
            "salt": salt,
            "password": hashed_password,
        },
    )
    await session.commit()

    access_token = create_access_token(data={"sub": request.email})

    user = UserSchema(
        name=request.name,
        email=request.email,
        phone_number=request.phone_number,
        type="buyer",
    )
    return UserRead(
        user_information=user, token=access_token, message="success, user created"
    )


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


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


def form_validation(request):
    if "@" not in request.email or "." not in request.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is not valid",
        )

    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )
    if request.password.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number",
        )
    if request.password.isnumeric():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one letter",
        )
    if request.password.isalnum():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character",
        )
    if request.password.islower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter",
        )
    if request.password.isupper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter",
        )
