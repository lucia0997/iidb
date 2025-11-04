from typing import Optional, Dict, List, Tuple, Any

from .exception_catalog import ErrorData, get_error_by_code
from .validation_errors import build_field_errors

ErrorPayload = Tuple[Dict[str, Any], int]

def exception_payload(
        code: str,
        *,
        message: Optional[str] = None,
        details: Optional[Dict[str,Any]] = None,
        field_errors: Optional[Any] = None,
) -> ErrorPayload:
    """
    Parameters:     
        code: error code that gets the error (kind, http_status, default_message) from the catalog
        message: optional user-safe message override of default_message
        details: optional non_sensitive metadata (trace ids, wait, ids, ...)
        field_errors: validation error tradeoff
    """

    error_data: ErrorData = get_error_by_code(code)
    body: Dict[str,Any] = {
        "error": {
            "code": error_data.code,
            "kind": error_data.kind,
            "message": message or error_data.default_message,
        }
    }
    if details: body["error"]["details"] = details
    if field_errors is not None: body["error"]["field_errors"] = field_errors
    return body, error_data.http_status

def validation_error_payload(
        *,
        drf_detail: Any,
        request_payload: Optional[Any],
        message: Optional[str] = None,
        details: Optional[Dict[str,Any]] = None,
        dense_arrays: bool = True,
        non_field_errors_key: str = 'errors',
        validation_code: str = "VALIDATION_FAILED"
) -> ErrorPayload:
    """
    """
    field_errors = build_field_errors(
        drf_detail,
        request_payload=request_payload,
        dense_arrays=dense_arrays,
        non_field_errors_key=non_field_errors_key
    )
    return exception_payload(
        validation_code,
        message=message,
        details=details,
        field_errors=field_errors
    )