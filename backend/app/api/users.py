from typing import Any, Generator

from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from starlette.responses import Response

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_db
from app.deps.sql_error import format_error
from app.models.user import User
from app.schemas.request_params import DefaultResponse
from app.schemas.user import (
    DeleteUser,
    GetUser,
    GetUserAddress,
    GetUserBalance,
    PutUserAddress,
    PutUserBalance,
)

router = APIRouter()


@router.get("", response_model=GetUser, status_code=status.HTTP_200_OK)
def get_user(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user


@router.get(
    "/shipping_address", response_model=GetUserAddress, status_code=status.HTTP_200_OK
)
def get_user_shipping_address(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user


@router.put(
    "/shipping_address", response_model=DefaultResponse, status_code=status.HTTP_200_OK
)
def put_user_shipping_address(
    request: PutUserAddress,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    current_user.address_name = request.address_name
    current_user.address = request.address
    current_user.city = request.city
    current_user.phone_number = request.phone_number

    session.commit()

    logger.info(f"User {current_user.email} updated shipping address")
    return DefaultResponse(message="Shipping address updated")


@router.get("/balance", response_model=GetUserBalance, status_code=status.HTTP_200_OK)
async def get_user_balance(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user


@router.put(
    "/balance", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED
)
def put_user_balance(
    request: PutUserBalance,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    new_balance = int(current_user.balance) + request.balance
    current_user.balance = new_balance
    try:
        session.commit()
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Integer value out of range"
            if "integer out of range" in format_error(e)
            else format_error(e),
        )
    logger.info(f"User {current_user.email} updated balance")
    return DefaultResponse(
        message=f"Your balance has been updated, Current Balance: {new_balance}"
    )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    request: DeleteUser,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> Response:
    try:
        session.query(User).filter(User.id == request.id).delete()
        session.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error(e),
        )
    logger.info(f"User {request.id} deleted by {current_user.email}")
