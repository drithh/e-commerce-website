import base64
import pytest

@pytest.fixture(scope="function")
def get_base64_image():
    def inner():
        with open("tests/fixtures/test_image.jpeg", "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode("utf-8")
            return f"data:image/jpeg;base64,{base64_string}"

    return inner