import base64


def base64_to_image(base64_string: str):
    # if base64_string has mime type, assume it's a data url else use iamge/png
    if base64_string.startswith("data:"):
        image_type = base64_string.split(",")[0].split("/")[1].split(";")[0]
    else:
        image_type = "png"
    # decode base64 but split it first
    image_base64 = base64_string.split(",")[1]
    image_data = base64.b64decode(image_base64)

    return image_data, image_type
