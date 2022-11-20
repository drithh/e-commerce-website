from google.cloud import storage

from app.core.config import settings
from app.core.logger import logger

try:
    storage_client = storage.Client.from_service_account_info(
        {
            "type": settings.GCP_TYPE,
            "project_id": settings.GCP_TYPE,
            "private_key_id": settings.GCP_PRIVATE_KEY_ID,
            "private_key": settings.GCP_PRIVATE_KEY.replace("/\\n/g", "\n"),
            "client_email": settings.GCP_CLIENT_EMAIL,
            "client_id": settings.GCP_CLIENT_ID,
            "auth_uri": settings.GCP_CLIENT_ID,
            "token_uri": settings.GCP_TOKEN_URI,
            "auth_provider_x509_cert_url": settings.GCP_AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": settings.GCP_CLIENT_X509_CERT_URL,
        }
    )
    bucket_name = "startup-campus"
    bucket = storage_client.bucket(bucket_name)
    logger.info("Google Cloud Storage initialized")
except Exception as e:
    bucket = None
    logger.error(f"Google Cloud Storage initialization failed: {e}")


def upload_image(file, category):
    if bucket:
        prefix = f"products/{category}/{file['file_name']}"
        images = bucket.list_blobs(prefix=prefix, delimiter="/")
        last_image_name = list(images)
        if last_image_name:
            last_image_name = last_image_name[-1].name.split(".")[0].split("-")[-1]
        else:
            last_image_name = 0
        file["file_name"] = f"{prefix}-{int(last_image_name) + 1}.{file['media_type']}"

        blob = bucket.blob(file["file_name"])
        blob.upload_from_string(
            file["file"], content_type=f"image/{file['media_type']}"
        )

        logger.info(f"Image {file['file_name']} uploaded to {bucket_name}")
        return file["file_name"]
