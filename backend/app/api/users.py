from typing import Any

from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy import update
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response

from app.api.authentications import get_current_active_user
from app.deps.db import get_async_session
from app.models.user import User
from app.schemas.user import UserGetAddress

router = APIRouter()


@router.get("", response_model=UserGetAddress)
async def get_user(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.get("/shipping_address", response_model=UserGetAddress)
async def get_user_shipping_address(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.post("/shipping_address", response_model=UserGetAddress)
async def post_user_shipping_address(
    request: UserGetAddress,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    await session.execute(
        update(User)
        .where(User.id == current_user.User.id)
        .values(
            address_name=request.address_name,
            address=request.address,
            city=request.city,
            phone_number=request.phone_number,
        )
    )
    await session.commit()

    return current_user.User
