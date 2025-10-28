from .base import *

# ___________________________ GENERAL CONF ___________________________

ALLOWED_HOSTS = ["*"]
DEBUG = True

# Debugging apps
# INSTALLED_APPS += [
#     "django_browser_reload",
# ]

# MIDDLEWARE += [
#     "django_browser_reload.middleware.BrowserReloadMiddleware",
# ]

# Trusted Origins

# ___________________________ CORS/CSRF ___________________________

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = False
"""
Test cookies locally
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:1234", "http://127.0.0.1:1234",
]
CORS_ALLOW_CREDENTIALS = True
"""
CORS_ALLOW_HEADERS = ["Authorization", "Content-Type", "X-CSRFToken"] 
CORS_EXPOSE_HEADERS = ["X-Request-ID"]

CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:1234", "http://127.0.0.1:1234",
]
                        # [origin.rstrip("/") for origin in CORS_ALLOWED_ORIGINS]

# ___________________________ LOGGING ___________________________

LOGGING['handlers'].update({
    "errors_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "filename": str(LOG_DIR / "errors.log"),
        "when": "midnight",
        "backupCount": 7,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "DEBUG",
    },
    "client_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "filename": str(LOG_DIR / "client_errors.log"),
        "when": "midnight",
        "backupCount": 7,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "DEBUG",
    }
})
LOGGING["loggers"]["django"]["level"] = "DEBUG"
LOGGING["loggers"]["app.errors"]["handlers"] = ["console", "errors_file"]
LOGGING["loggers"]["app.client"]["handlers"] = ["console", "client_file"]