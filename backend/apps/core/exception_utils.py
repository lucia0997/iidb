import json
import logging
from typing import Dict, Any, Optional

from rest_framework.response import Response

logger = logging.getLogger("app.errors")

def _request_meta(
        context: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    request = context.get('request')
    if not request: return {}
    meta = {
        "user_id": getattr(getattr(request,"user",None), "id", None),
        "method": getattr(request, "method", None),
        "path": request.get_full_path() if hasattr(request, "get_full_path") else None,
        "rquest_id": getattr(request, "rquest_id", None),
    }
    return {k: v for k, v in meta.items() if v is not None} or None

def _log_error(
        status: int,
        code: str,
        kind: str,
        meta:  Optional[Dict[str, Any]], 
        extra: Optional[Dict[str, Any]] = None
) -> None:
    record = {
        "status": status,
        "code": code,
        "kind": kind,
        **meta,
    }
    if extra: record.update(extra)

    logger.error(json.dumps(record, separators=(",",":")))

def _request_id_header(
        resp: Response,
        meta: Optional[Dict[str, Any]]
) -> None:
    request_id = meta.get("request_id")
    if request_id: resp["X-Request-ID"] = str(request_id)