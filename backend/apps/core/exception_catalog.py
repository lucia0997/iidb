from typing import Literal, List, Dict
from dataclasses import dataclass

# Error types
ErrorKind = Literal["auth", "permission", "not_found", "validation", "conflict", "client", "server", "rate_limit", "unknown"]

@dataclass(frozen=True)
class ErrorData: 
    code: str
    kind: ErrorKind
    http_status: int
    default_message: str

# Errors table: code ↔ kind (+ status, default message)
ERRORS_DATA: List[ErrorData] = [
    # DRF errors
    ErrorData("VALIDATION_FAILED",      "validation",   422,    "Validation erros in the submitted data."),
    ErrorData("NOT_AUTHENTICATED",      "auth",         401,    "Not authenticated."),
    ErrorData("INVALID_CREDENTIALS",    "auth",         401,    "Invalid credentials."),
    ErrorData("PERMISSION_DENIED",      "permission",   403,    "You do not have permissions to perform this action."),
    ErrorData("NOT_FOUND",              "not_found",    404,    "Resource not found."),
    ErrorData("RATE_LIMITED",           "rate_limit",   429,    "Too many requests. Please try again later."),
    ErrorData("BAD_REQUEST",            "client",       400,    "Invalid request."),
    ErrorData("CONFLICT",               "conflict",     409,    "State conflict."),
    ErrorData("SERVER_ERROR",           "server",       500,    "An internal server error ocurred."),

    # Custom errors
    ErrorData("EXAMPLE_ERROR",          "client",       400,    "Example text."),
    
    # Fallback
    ErrorData("UNKNOWN_ERROR",          "unknown",      500,    "Unknown error.")
]

ERROR_BY_CODE: Dict[str, ErrorData] = {error.code: error for error in ERRORS_DATA}

def get_error_by_code(code: str) -> ErrorData:
    return ERROR_BY_CODE.get(code, ERROR_BY_CODE["UNKNOWN_ERROR"])

def get_error_from_status(http_status: int) -> ErrorData:
    for error_data in ERRORS_DATA:
        if error_data.http_status == http_status:
            return error_data
        
    if 400 <= http_status < 500:
        return ERROR_BY_CODE["BAD_REQUEST"]
    if 500 <= http_status < 600:
        return ERROR_BY_CODE["SERVER_ERROR"]
    return ERROR_BY_CODE["UNKNOWN_ERROR"]