from typing import Dict, Optional, Any
from rest_framework.exceptions import APIException
from rest_framework import status
from .exception_catalog import get_error_by_code, ErrorKind
    

class AppAPIException(APIException):
    """
    Generic application exception that carries a normalized error contract.

    Usage:
        raise AppApiException(
            error_code = "EXAMPLE_ERROR", (Must exist in error data, otherwise UNKNOWN_ERROR)
            detail: optional string = "Information about the error",
            extra: optional dict = {"field": "value",...}
        )
    """

    def __init__(
            self, 
            *,
            error_code: str, 
            detail: Optional[str] = None, 
            extra: Optional[Dict[str, Any]] = None, 
        ) -> None:
        
        data = get_error_by_code(error_code)

        self.error_code: str = data.code
        self.kind: ErrorKind = data.kind
        self.extra: Dict[str, Any] = extra or {}

        message = detail or data.default_message
        super().__init__(detail = message)
        self.status_code = data.http_status
