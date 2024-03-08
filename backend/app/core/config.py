import sys
from typing import Any, Dict, List, Optional

from pydantic import BaseSettings, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "e-commerce-website"
    VERSION: str = "0.1.0"

    SENTRY_DSN: Optional[HttpUrl] = None

    API_PATH: str = "/v1"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    BACKEND_CORS_ORIGINS: List[str] = []

    # The following variables need to be defined in environment

    TEST_DATABASE_URL: Optional[PostgresDsn]
    DATABASE_URL: PostgresDsn
    ASYNC_DATABASE_URL: Optional[PostgresDsn]

    @validator("DATABASE_URL", pre=True)
    def build_test_database_url(cls, v: Optional[str], values: Dict[str, Any]):
        """Overrides DATABASE_URL with TEST_DATABASE_URL in test environment."""
        if "pytest" in sys.modules:
            if not values.get("TEST_DATABASE_URL"):
                raise Exception(
                    "pytest detected, but TEST_DATABASE_URL is not set in environment"
                )
            return values["TEST_DATABASE_URL"]
        return v

    @validator("ASYNC_DATABASE_URL")
    def build_async_database_url(cls, v: Optional[str], values: Dict[str, Any]):
        """Builds ASYNC_DATABASE_URL from DATABASE_URL."""
        v = values["DATABASE_URL"]
        return v.replace("postgresql", "postgresql+asyncpg") if v else v

    TEST_BUCKET_NAME: Optional[str]
    BUCKET_NAME: str

    @validator("BUCKET_NAME", pre=True)
    def build_test_bucket_name(cls, v: Optional[str], values: Dict[str, Any]):
        """Builds BUCKET_NAME from TEST_BUCKET_NAME in test environment."""
        if "pytest" in sys.modules:
            if not values.get("TEST_BUCKET_NAME"):
                raise Exception(
                    "pytest detected, but TEST_BUCKET_NAME is not set in environment"
                )
            return values["TEST_BUCKET_NAME"]
        return v

    SECRET_KEY: str

    CLOUD_STORAGE: str

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    USE_CREDENTIALS: bool
    VALIDATE_CERTS: bool

    # Twitter
    TWITTER_API: str

    # Backend URL
    VITE_APP_BACKEND_URL: str

    # Google Cloud Platform
    GCP_TYPE: str
    GCP_PROJECT_ID: str
    GCP_PRIVATE_KEY_ID: str
    GCP_PRIVATE_KEY: str
    GCP_CLIENT_EMAIL: str
    GCP_CLIENT_ID: str
    GCP_AUTH_URI: str
    GCP_TOKEN_URI: str
    GCP_AUTH_PROVIDER_X509_CERT_URL: str
    GCP_CLIENT_X509_CERT_URL: str
    #  END: required environment variables

    class Config:
        env_file = ".env"


settings = Settings()
