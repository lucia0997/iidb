import os
from .base import *

# ___________________________ GENERAL CONF ___________________________

ALLOWED_HOSTS = ['*']
            # os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
DEBUG = True

# Debugging apps
# INSTALLED_APPS += [
#     "django_browser_reload",
# ]

# MIDDLEWARE += [
#     "django_browser_reload.middleware.BrowserReloadMiddleware",
# ]

# ___________________________ CORS/CSRF ___________________________

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://app-dev.com", 
]
# CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://[\w-]+\.com"]

CORS_ALLOW_HEADERS = ["Authorization", "Content-Type", "X-CSRFToken"] 
CORS_EXPOSE_HEADERS = ["X-Request-ID"]

CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://app-dev.com", 
]
                        # [origin.rstrip("/") for origin in CORS_ALLOWED_ORIGINS]

"""
Dev frontend and api are on different registable sites using cookies
CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_ORIGIN = True
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
"""

# ___________________________ DATABASE ___________________________

DB_NAME = os.getenv("DB_NAME", "app_dev")
DB_USER = os.getenv("DB_USER", "app")
DB_USER_PASSWORD = os.getenv("DB_USER_PASSWORD", "app")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5342")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_USER_PASSWORD,
        "HOST": DB_HOST,
        "PORT": DB_PORT,
    }
}

# ___________________________ THROTTLE ___________________________

# REST_FRAMEWORK.update({
#   "DEFAULT_THROTTLE_CLASSES": [
#       "rest_framework.throttling.UserRateThrottle",
#       "rest_framework.throttling.AnonRateThrottle",
#   ],
#   "DEFAULT_THROTTLE_RATES": {
#       "user": "5000/day",   # Define the maximum allowed petitions per user and day
#       "anon": "1000/day",
#   }
# }

# ___________________________ LOGGING ___________________________

LOGGING['handlers'].update({
    "errors_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "filename": str(LOG_DIR / "errors.log"),
        "when": "midnight",
        "backupCount": 14,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "DEBUG",
    },
    "client_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "filename": str(LOG_DIR / "client_errors.log"),
        "when": "midnight",
        "backupCount": 14,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "DEBUG",
    }
})
LOGGING["loggers"]["app.errors"]["handlers"] = ["console", "errors_file"]
LOGGING["loggers"]["app.client"]["handlers"] = ["console", "client_file"]
