from typing import Any, Generator, List

from fastapi import HTTPException, Response, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_db
from app.deps.image_base64 import base64_to_image
from app.models.image import Image
from app.schemas.search import GetImage, SearchText

router = APIRouter()


@router.get("", response_model=GetImage, status_code=status.HTTP_200_OK)
async def get_image(
    image_name: str,
    session: Generator = Depends(get_db),
) -> Any:
    image_name = image_name.lower()
    image = session.query(Image).filter(Image.name.like(f"%{image_name}%")).first()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    return GetImage(
        name=image.name,
        image_url=f"{settings.CLOUD_STORAGE}/{image.image_url}",
    )


@router.get("/search", response_model=List[SearchText], status_code=status.HTTP_200_OK)
def search_text(
    text: str,
    session: Generator = Depends(get_db),
) -> Any:
    products = session.execute(
        """
            SELECT id, title FROM search_products(:text);
        """,
        {"text": text},
    ).fetchall()
    return products


# @router.post("/search_image", status_code=status.HTTP_200_OK)
# def search_image(
#     request: SearchImage,
#     session: Generator = Depends(get_db),
# ) -> Any:
#     # filename = "test.png"
#     # decode base64 but split it first
#     img_data, image_type = base64_to_image(request.image)
#     return Response(content=img_data, media_type=f"image/{image_type}")

#     # try:
#     #     with open("uploaded_" + filename, "wb") as f:
#     #         f.write(img_recovered)
#     # except Exception:
#     #     return {"message": "There was an error uploading the file"}

#     # return {"message": f"Successfuly uploaded {filename}"}
