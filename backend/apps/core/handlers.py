import logging
from typing import Dict, Any

from django.http import Http404
from rest_framework.exceptions import (
    APIException,
    ValidationError, 
    NotAuthenticated,
    AuthenticationFailed,
    PermissionDenied,
    Throttled
) 
from rest_framework.response import Response

from .exception_contract import exception_payload, validation_error_payload
from .exceptions import AppAPIException
from .exception_catalog import get_error_from_status
from .exception_utils import _log_error, _request_id_header, _request_meta

logger = logging.getLogger("app.errors")
DENSE_ARRAYS = True # Error lists with the payload length


def exception_handler(exc: Exception, context: Dict[str, Any]) -> Response:
    """
    Common error source for unifying the error responses as:
    {
        "error": {
            "code": str,
            "kind": str,
            "message": str,
            "details": Optional (non-sensitive)
            "field_errors": Validation request-shaped errors struct
        }
    }
    
    """
    request = context.get("request")
    meta = _request_meta(context)

    # Error cases:
    if isinstance(exc, ValidationError):
        payload, status = validation_error_payload(
            drf_detail=exc.detail,
            request_payload=getattr(request, "data", None),
            details = meta,
            dense_arrays=DENSE_ARRAYS,
            non_field_errors_key="errors"
        )
        extra = {"reason": "ValidationError"}
    
    elif isinstance(exc, NotAuthenticated):
        payload, status = exception_payload(
            "NOT_AUTHENTICATED",
            message = str(getattr(exc, "detail", "")) or None,
            details = meta,
        )
        extra = {}
        
    elif isinstance(exc, AuthenticationFailed):
        payload, status = exception_payload(
            "INVALID_CREDENTIALS",
            message = str(getattr(exc, "detail", "")) or None,
            details = meta,
        )
        extra = {}
        
    elif isinstance(exc, PermissionDenied):
        payload, status = exception_payload(
            "PERMISSION_DENIED",
            message = str(getattr(exc, "detail", "")) or None,
            details = meta,
        )
        extra = {}
        
    elif isinstance(exc, Http404):
        payload, status = exception_payload(
            "NOT_FOUND",
            message = str(getattr(exc, "detail", "")) or None,
            details = meta,
        )
        extra = {}
        
    elif isinstance(exc, Throttled):
        wait_seconds = {"wait": getattr(exc, "wait", None)}
        payload, status = exception_payload(
            "RATE_LIMITED",
            message = str(getattr(exc, "detail", "")) or None,
            details = {**meta, **wait_seconds},
        )
        extra = wait_seconds
        
    elif isinstance(exc, AppAPIException):
        meta = {**meta, **dict(exc.extra or {})}
        payload, status = exception_payload(
            exc.error_code,
            message = str(getattr(exc, "detail", "")) or None,
            details = meta,
        )
        extra = {}
        
    elif isinstance(exc, APIException):
        error_data = get_error_from_status(int(getattr(exc, "status_code", 500)))
        payload, status = exception_payload(
            error_data.code,
            message = str(getattr(exc, "detail", "")) or error_data.default_message or None,
            details = meta,
        )
        extra = {}
        
    else:
        payload, status = exception_payload(
            "SERVER_ERROR",
            details = meta,
        )
        extra = {"reason": "UnhandledException"}

    _log_error(status, 
        payload["error"]["code"], 
        payload["error"]["kind"], 
        meta,
        extra, 
        )
    resp = Response(payload, status=status)
    _request_id_header(resp, meta)
    return resp

