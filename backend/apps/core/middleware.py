
import uuid
import contextvars
from typing import Callable
from django.http import HttpRequest, HttpResponse

request_id_var: contextvars.ContextVar[str| None] = contextvars.ContextVar("request_id", default=None)

class RequestIDMiddleware:
    """
    - Reads incoming X-Request-ID (if present & valid UUID), oherwise generates a new UUID4
    - Exposes as:
        - request.request_id: uuid.UUID
        - response header: X-Request-ID
        - contextvar: request_id_var (str)
    """

    header_name = "X-Request-ID"

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        incoming = request.META.get("HTTP_X_REQUEST_ID")
        request_id = _parse_uuid(incoming) or uuid.uuid4()

        setattr(request, "request_id", request_id)
        request_id_var.set(str(request_id))
        response = self.get_response(request)

        try:
            response[self.header_name] = str(request_id)
        except:
            pass
        return response



def _parse_uuid(
        value: str | None
) -> uuid.UUID | None:
    if not value: return None
    try:
        return uuid.UUID(str(value))
    except:
        return None