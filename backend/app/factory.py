from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from app.api import (
    authentications,
    carts,
    categories,
    homes,
    images,
    orders,
    products,
    sales,
    users,
)
from app.core.config import settings
from app.core.logger import logger


def create_app():
    description = f"{settings.PROJECT_NAME} API"
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_PATH}/openapi.json",
        docs_url="/docs/",
        description=description,
        redoc_url="/redoc/",
    )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc):
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        if hasattr(exc, "detail"):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": exc.detail},
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": exc.errors()},
            )

    setup_routers(app)
    init_db_hooks(app)
    setup_cors_middleware(app)
    serve_static_app(app)

    return app


def setup_routers(app: FastAPI) -> None:
    app.include_router(
        authentications.router,
        prefix=f"{settings.API_PATH}",
        tags=["Authentication"],
    )
    app.include_router(
        users.router,
        prefix=f"{settings.API_PATH}/user",
        tags=["User"],
    )
    app.include_router(
        images.router,
        prefix=f"{settings.API_PATH}/image",
        tags=["Image"],
    )
    app.include_router(
        homes.router,
        prefix=f"{settings.API_PATH}/home",
        tags=["Home"],
    )
    app.include_router(
        products.router,
        prefix=f"{settings.API_PATH}/products",
        tags=["Product"],
    )
    app.include_router(
        categories.router,
        prefix=f"{settings.API_PATH}/categories",
        tags=["Category"],
    )
    app.include_router(
        carts.router,
        prefix=f"{settings.API_PATH}/cart",
        tags=["Cart"],
    )
    app.include_router(
        sales.router,
        prefix=f"{settings.API_PATH}",
        tags=["Sales"],
    )
    app.include_router(
        orders.router,
        prefix=f"{settings.API_PATH}",
        tags=["Order"],
    )

    # The following operation needs to be at the end of this function
    use_route_names_as_operation_ids(app)


def serve_static_app(app):
    app.mount("/", StaticFiles(directory="static"), name="static")

    @app.middleware("http")
    async def _add_404_middleware(request: Request, call_next):
        """Serves static assets on 404"""
        response = await call_next(request)
        path = request["path"]
        if path.startswith(settings.API_PATH) or path.startswith("/docs"):
            return response
        if response.status_code == 404:
            return FileResponse("static/index.html")
        return response


def setup_cors_middleware(app):
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            expose_headers=["Content-Range", "Range"],
            allow_headers=["Authorization", "Range", "Content-Range"],
        )


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    route_names = set()
    for route in app.routes:
        if isinstance(route, APIRoute):
            if route.name in route_names:
                raise Exception("Route function names should be unique")
            route.operation_id = route.name
            route_names.add(route.name)


def init_db_hooks(app: FastAPI) -> None:
    from app.db import database

    @app.on_event("startup")
    async def startup():
        await database.connect()

    @app.on_event("shutdown")
    async def shutdown():
        await database.disconnect()
