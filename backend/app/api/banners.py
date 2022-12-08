from typing import Generator
from uuid import UUID

from fastapi import HTTPException, Query, status
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.authentication import get_current_active_admin
from app.deps.db import get_db
from app.deps.google_cloud import upload_image
from app.deps.image_base64 import base64_to_image
from app.deps.sql_error import format_error
from app.models.banner import Banner
from app.models.image import Image
from app.models.user import User
from app.schemas.banner import Banner as BaseBanner
from app.schemas.banner import CreateBanner, GetBanners, UpdateBanner
from app.schemas.default_model import DefaultResponse

router = APIRouter()


@router.get("", response_model=GetBanners, status_code=status.HTTP_200_OK)
def get_banners(
    session: Generator = Depends(get_db),
) -> JSONResponse:
    banners = session.execute(
        f"""
            SELECT banners.id, title, CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(image_url, 'image-not-available.webp')) AS image,
            COALESCE(url_path, '/products') AS url_path, text_position
            FROM only banners
            LEFT JOIN images ON banners.image_id = images.id
            """
    ).fetchall()
    if not banners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There are no banners",
        )
    return GetBanners(data=banners)


@router.get("/{banner_id}", response_model=BaseBanner, status_code=status.HTTP_200_OK)
def get_banner(
    banner_id: UUID,
    session: Generator = Depends(get_db),
) -> JSONResponse:
    banner = session.execute(
        f"""
            SELECT banners.id, title, CONCAT('{settings.CLOUD_STORAGE}/', COALESCE(image_url, 'image-not-available.webp')) AS image,
            COALESCE(url_path, '/products') AS url_path, text_position
            FROM only banners
            LEFT JOIN images ON banners.image_id = images.id
            WHERE banners.id = '{banner_id}'
            """
    ).fetchone()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found",
        )
    return banner


@router.post("", response_model=DefaultResponse, status_code=status.HTTP_201_CREATED)
def create_banner(
    request: CreateBanner,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    if not request.image.startswith("data:image"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Please use base64 format with data:image",
        )
    title_slug = request.title.lower().replace(" ", "-")
    image_data, image_type = base64_to_image(request.image)
    file = {
        "file": image_data,
        "media_type": image_type,
        "file_name": title_slug,
    }
    image_url = upload_image(file, "banners")
    if image_url is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed, because of cloud storage error",
        )

    name = image_url.split("/")[-1].split(".")[0]
    image = Image(name=name, image_url=image_url)
    
    session.add(image)
    session.commit()
    session.refresh(image)

    # create banner
    try:
        banner = Banner(
            title=request.title,
            image_id=image.id,
            url_path=request.url_path,
            text_position=request.text_position,
        )
        session.add(banner)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=format_error(e)
        )

    return DefaultResponse(message="Banner created successfully")


@router.put("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def update_banner(
    request: UpdateBanner,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    banner = session.query(Banner).filter(Banner.id == request.id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found"
        )

    if request.image:
        if request.image == "delete":
            banner.image_id = None
        else:
            if not request.image.startswith("data:image"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid image format. Please use base64 format with data:image",
                )
            title_slug = request.title.lower().replace(" ", "-")
            image_data, image_type = base64_to_image(request.image)
            file = {
                "file": image_data,
                "media_type": image_type,
                "file_name": title_slug,
            }
            image_url = upload_image(file, "banners")
            if image_url is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Image upload failed, because of cloud storage error",
                )

            name = image_url.split("/")[-1].split(".")[0]
            image = Image(name=name, image_url=image_url)

            session.add(image)
            session.commit()
            session.refresh(image)

            banner.image_id = image.id

    banner.title = request.title
    banner.url_path = request.url_path
    banner.text_position = request.text_position

    session.commit()


    return DefaultResponse(message="Banner updated successfully")


@router.delete("", response_model=DefaultResponse, status_code=status.HTTP_200_OK)
def delete_banner(
    id: UUID,
    session: Generator = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
) -> JSONResponse:
    banner = session.query(Banner).filter(Banner.id == id).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found"
        )

    session.delete(banner)
    session.commit()
    
    return DefaultResponse(message="Banner deleted successfully")
