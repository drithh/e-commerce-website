from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from starlette.responses import Response

from app.core.logger import logger
from app.deps.authentication import get_current_active_admin, get_current_active_user
from app.deps.db import get_async_session
from app.models.user import User
from app.schemas.request_params import DefaultResponse

router = APIRouter()
