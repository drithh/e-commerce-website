import random
from asyncio import sleep
from datetime import datetime, timedelta
from typing import Any, Generator, List

import requests
from fastapi import HTTPException, Response, status
from fastapi.params import Depends
from fastapi.routing import APIRouter

from app.core.config import settings
from app.core.logger import logger
from app.deps.db import get_db
from app.deps.image_base64 import base64_to_image
from app.models.image import Image
from app.schemas.search import (
    GetImage,
    SearchImage,
    SearchImageResponse,
    SearchText,
    ShowerThoughts,
)

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


@router.post(
    "/search_image", response_model=SearchImageResponse, status_code=status.HTTP_200_OK
)
async def search_image(
    request: SearchImage,
    session: Generator = Depends(get_db),
) -> Any:
    img_data, image_type = base64_to_image(request.base64_image)
    # sleep(5)
    await sleep(15)
    return session.execute(
        """
            SELECT id, title FROM
            categories
        """
    ).fetchone()
    return Response(content=img_data, media_type=f"image/{image_type}")


@router.get(
    "/shower-thoughts",
    response_model=ShowerThoughts,
    status_code=status.HTTP_200_OK,
)
async def shower_thoughts() -> Any:
    start = datetime(2022, 1, 1)
    end = datetime.now() - timedelta(days=7)

    random_date = start + (end - start) * random.random()
    random_date = random_date.strftime("%Y-%m-%dT%H:%M:%SZ").replace(" ", "%20")

    shower_thought_url = "https://api.twitter.com/2/users/854354686194929664/tweets"
    url = f"{shower_thought_url}?max_results=8&end_time={random_date}"
    data = requests.get(
        headers={"Authorization": f"Bearer {settings.TWITTER_API}"},
        url=f"{url}&tweet.fields=&expansions=&exclude=replies%2Cretweets",
    ).json()

    try:
        tweets = [tweet["text"] for tweet in data["data"] if len(tweet["text"]) < 100]
        return ShowerThoughts(data=tweets)
    except AttributeError:
        return ShowerThoughts(data=["No shower thoughts found"])
