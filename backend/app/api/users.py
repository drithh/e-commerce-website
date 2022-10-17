from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from sqlalchemy import delete, select, update
from sqlalchemy.exc import DatabaseError
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_async_session
from app.models.user import User
from app.schemas.request_params import DefaultResponse
from app.schemas.user import (
    DeleteUser,
    GetUser,
    GetUserAddress,
    GetUserBalance,
    PutUserBalance,
)

router = APIRouter()


@router.get("", response_model=GetUser, status_code=status.HTTP_200_OK)
async def get_user(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_user(
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    user = (await session.execute(select(User))).all()
    return user


@router.get(
    "/shipping_address", response_model=GetUserAddress, status_code=status.HTTP_200_OK
)
async def get_user_shipping_address(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.put(
    "/shipping_address", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
async def put_user_shipping_address(
    request: GetUserAddress,
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
    logger.info(f"User {current_user.User.email} updated shipping address")
    return DefaultResponse(message="Shipping address updated")


@router.get("/balance", response_model=GetUserBalance, status_code=status.HTTP_200_OK)
async def get_user_balance(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user.User


@router.put(
    "/balance", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED
)
async def put_user_balance(
    request: PutUserBalance,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user),
):
    new_balance = int(current_user.User.balance) + request.balance
    await session.execute(
        update(User).where(User.id == current_user.User.id).values(balance=new_balance)
    )
    await session.commit()
    logger.info(f"User {current_user.User.email} updated balance")
    return DefaultResponse(
        message=f"Your balance has been updated, current_balance:{new_balance}"
    )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    request: DeleteUser,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_admin),
) -> Response:
    try:
        await session.execute(delete(User).where(User.id == request.id))
    except DatabaseError as e:
        error = (
            e.orig.args[0]
            .split("DETAIL:")[1]
            .strip()
            .replace('"', "")
            .replace("\\", "")
        )
        logger.error(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{error}"
        )
    logger.info(f"User {request.id} deleted by {current_user.User.email}")
    await session.commit()
