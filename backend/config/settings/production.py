import os
from .base import *

# ___________________________ GENERAL CONF ___________________________

ALLOWED_HOSTS = ["*"]
            # os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
DEBUG = False

# ___________________________ SECURITY (HTTPS) ___________________________

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")                       # Trust reverse proxy header (mark request as HTTPS)
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "true").lower() == "true"    # Force HTTP -> HTTPS redirects
SESSION_COOKIE_SECURE = True                                                        # Send a session cookie only over HTTPS
CSRF_COOKIE_SECURE = True                                                           # Send CSRF cookie only over HTTPS
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))             # Enable browser HTTP enforcement conf for N seconds
SECURE_HSTS_INCLUDE_SUBDOMAINS = True                                               # Include subdomains in the HSTS policy
SECURE_HSTS_PRELOAD = True                                                          # Allow domain to be preload in the browser
SECURE_CONTENT_TYPE_NOSNIFF = True                                                  # Prevent MIME type sniffing (X-Content-Type-Options: nosniff)
SECURE_REFERRER_POLICY = "same-origin"                                              # Limit referer header to same-origin requests
X_FRAME_OPTIONS = "DENY"                                                            # Prevent clickjacking by disallowing framing

# ___________________________ CORS/CSRF ___________________________

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [origin for origin in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if origin]
""" [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://app-prod.com", 
] """
# CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://[\w-]+\.com"]

CORS_ALLOW_HEADERS = [
    "Accept", 
    "Accept-Language",
    "Content-Type", 
    "X-CSRFToken",
    "Authorization"
] 
CORS_EXPOSE_HEADERS = ["X-Request-ID"]

CSRF_TRUSTED_ORIGINS = [origin for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if origin]
""" [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://app-dev.com", 
] """
                        # [origin.rstrip("/") for origin in CORS_ALLOWED_ORIGINS]

"""
Dev frontend and api are on different registable sites using cookies
CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_ORIGIN = True
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
"""

# ___________________________ EMAIL ___________________________

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIIL_HOST = os.getenv("EMAIIL_HOST","smtp.sendgrid.net")
EMAIL_PORT = os.getenv("EMAIL_PORT","587")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER","")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD","")
EMAIL_USE_TLS = True

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
        "CONN_MAX_AGE": 1000,
        "OPTIONS": {
            "sslmode": os.getenv("DB_SSLMODE", "prefer")
        }
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
        "backupCount": 30,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "INFO",
    },
    "client_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "filename": str(LOG_DIR / "client_errors.log"),
        "when": "midnight",
        "backupCount": 30,
        "encoding": "utf-8",
        "formatter": "verbose",
        "level": "INFO",
    }
})
LOGGING["loggers"]["app.errors"] = {
    "handlers": ["errors_file"], 
    "level": "INFO", 
    "propagate": False
    }
LOGGING["loggers"]["app.client"] = {
    "handlers": ["client_file"], 
    "level": "INFO", 
    "propagate": False
    }
LOGGING["loggers"]["errors"]["level"] = "INFO"



# STATIC_ROOT is a setting that specifies the absolute file system path where Django will collect all static files from each app into a single directory when you run the collectstatic management command.
# With this configuration, running python manage.py collectstatic will gather all static files into the staticfiles directory within your project’s base directory.
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# For HTTPS settings consult https://medium.com/django-unleashed/how-to-secure-django-applications-with-https-and-ssl-a-comprehensive-guide-in-2024-f56b4ce11810
LOG_FILE_PATH = os.path.join(LOG_DIR, "django_logs.log")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 10 * 1024 * 1024,  # 10 MB
            "filename": LOG_DIR,
            "formatter": "verbose",
        },
    },
    "formatters": {
        "verbose": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        },
    },
    "root": {
        "handlers": ["file"],
        "level": "DEBUG",
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

