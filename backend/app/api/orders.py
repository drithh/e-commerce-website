from fastapi import status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.logger import logger
from app.deps.db import get_db
from app.models.user import User
from app.schemas.request_params import DefaultResponse

router = APIRouter()
