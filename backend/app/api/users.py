from datetime import datetime
from typing import Any

from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy import update
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response

from app.api.authentications import get_current_active_admin, get_current_active_user
from app.deps.db import get_async_session
from app.models.user import User
from app.schemas.user import (
    UserDelete,
    UserGetAddress,
    UserGetBalance,
    UserPutAddress,
    UserPutBalance,
    UserPutBalanceRequest,
)

router = APIRouter()


@router.get("", response_model=UserGetAddress, status_code=200)
async def get_user(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.get("/shipping_address", response_model=UserGetAddress, status_code=200)
async def get_user_shipping_address(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.put("/shipping_address", response_model=UserPutAddress, status_code=200)
async def put_user_shipping_address(
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
    return "Shipping address updated"


@router.get("/balance", response_model=UserGetBalance, status_code=200)
async def get_user_balance(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.put("/balance", response_model=UserPutBalance, status_code=201)
async def put_user_balance(
    request: UserPutBalanceRequest,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user),
):
    await session.execute(
        update(User)
        .where(User.id == current_user.User.id)
        .values(balance=request.balance)
    )
    await session.commit()
    return "Balance updated"


@router.delete("", status_code=204)
async def delete_user(
    request: UserDelete,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_admin),
) -> Response:
    await session.execute(
        update(User).where(User.id == request.id).values(deleted_at=datetime.now())
    )
    await session.commit()
