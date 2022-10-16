class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str, headers: dict = None):
        self.status_code = status_code
        self.message = detail
        self.headers = headers
