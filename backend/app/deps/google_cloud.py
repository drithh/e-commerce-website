import os

from google.cloud import storage

from app.core.logger import logger

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"

storage_client = storage.Client()

bucket_name = "startup-campus"
bucket = storage_client.bucket(bucket_name)


def upload_image(file, category):
    prefix = f"products/{category}/{file['file_name']}"
    images = bucket.list_blobs(prefix=prefix, delimiter="/")
    last_image_name = list(images)
    if last_image_name:
        last_image_name = last_image_name[-1].name.split(".")[0].split("-")[-1]
    else:
        last_image_name = 0
    file["file_name"] = f"{prefix}-{int(last_image_name) + 1}.{file['media_type']}"

    blob = bucket.blob(file["file_name"])
    blob.upload_from_string(file["file"], content_type=f"image/{file['media_type']}")

    logger.info(f"Image {file['file_name']} uploaded to {bucket_name}")
    return file["file_name"]
