import os

from google.cloud import storage

from app.core.logger import logger

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"

storage_client = storage.Client()

bucket_name = "startup-campus"
bucket = storage_client.bucket(bucket_name)


def upload_image(file):
    blob = bucket.blob(file.filename)
    # get list uploaded files with prefix name file
    blobs = bucket.list_blobs(prefix="products/bags/buckle", delimiter="/")
    # check if file already exists
    logger.info(f"file: {file.filename}")
    for blob in blobs:
        logger.info(f"blob: {blob.name}")
    # blob.upload_from_file(file.file)
    # blob.make_public()
    # return blob.public_url
