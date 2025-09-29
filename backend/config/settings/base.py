import os
import ssl
import environ
from datetime import timedelta
from pathlib import Path


# ___________________________ PATH & ENV VARS ___________________________

BASE_DIR = Path(__file__).resolve().parents[3]

env =  environ.Env(
    # set casting, default value
    DEBUG = (bool, False)
)
environ.Env.read_env(BASE_DIR / ".env")

ROOT_PATH = env("ROOT_PATH")

MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = ROOT_PATH + "media/"

STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = ROOT_PATH + "static/"
"""STATICFILES_DIRS = [
    BASE_DIR / "common_static",
    BASE_DIR / "shared_data",
]"""

# ___________________________ HOSTS ___________________________

ALLOWED_HOSTS: list[str] = []
CORS_ALLOWED_ORIGINS = []
CSRF_TRUSTED_ORIGINS = []

# ___________________________ SECRET KEYS ___________________________

ADMIN_PASSWORD = env("ADMIN_PASSWORD")
SECRET_KEY = env("SECRET_KEY")
JWT_SECRET_KEY = env("JWT_SECRET_KEY")

# ___________________________ INSTALLED APPS ___________________________

INSTALLED_APPS = [
    # Django core
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "rest_framework",                   # Django REST Framework 
    "rest_framework_simplejwt",         # JWT authentication for REST Framework
    "django_python3_ldap",              # LDAP authentication base backend
    "django_filters",                   # Django filters for query parameter filtering
    "django_extensions",                # Django management extra tools
    "corsheaders",                      # CORS headers for cross-origin requests

    # Local apps
    "apps.core",                        # User defined shared app functionalities
    "apps.authentication",              # Authentication 
    "apps.authorization",               # Authorization
    "apps.users",                       # User Management
]

# ___________________________ MIDDLEWARE ___________________________

MIDDLEWARE = [             
    "django.middleware.security.SecurityMiddleware",                # Headers, HTTPS and protection
    "corsheaders.middleware.CorsMiddleware",                        # Cross-origin header    
    "django.contrib.sessions.middleware.SessionMiddleware",         # Cookie-backed sessions
    "django.middleware.common.CommonMiddleware",                    # HTTP utilities
    "django.middleware.csrf.CsrfViewMiddleware",                    # CSRF token validation
    "django.contrib.auth.middleware.AuthenticationMiddleware",      # request.user functionality
    "django.contrib.messages.middleware.MessageMiddleware",         # Flash message storage
    "django.middleware.clickjacking.XFrameOptionsMiddleware",       # Click-jacking header
    "apps.core.middleware.RequestIDMiddleware",                         # RequestID & X-Request-ID header
]

ROOT_URLCONF = "config.urls"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
WSGI_APPLICATION = "config.wsgi.application"

# ___________________________ DATABASE ___________________________

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
        "OPTIONS": {
            "timeout": 20,
        },
    }
}

# ___________________________ AUTH / LDAP ___________________________

AUTH_USER_MODEL = "users.User"

AUTHENTICATION_BACKENDS = [
    "apps.authentication.backends.LDAPAuthenticationBackend",
]

LDAP_AUTH_URL = env("LDAP_AUTH_URL")                    # URL of the LDAP server
LDAP_AUTH_USE_TLS = True                                # Initiate TLS
LDAP_AUTH_TLS_VERSION = ssl.PROTOCOL_TLSv1_2            # Specify which TLS version to use (Python 3.10 requires TLSv1 or higher)

LDAP_AUTH_BIND_DN = env("LDAP_AUTH_BIND_DN")            # LDAP bind credentials
LDAP_AUTH_BIND_PASSWORD = env("LDAP_AUTH_BIND_PASSWORD")

LDAP_AUTH_SEARCH_BASE = env("LDAP_AUTH_SEARCH_BASE")    # LDAP user search settings
LDAP_AUTH_USER_LOOKUP_FIELDS = ("sAMAccountName",)      # User lookup settings
LDAP_AUTH_USER_FIELDS = {                               # LDAP attribute mapping
    "username": "sAMAccountName",
    "email": "mail",
}
LDAP_AUTH_OBJECT_CLASS = "user"

# ___________________________ PASSWORD VALIDATORS ___________________________

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ___________________________ I18N / TZ ___________________________

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Berlin"
USE_I18N = True
USE_TZ = True

# ___________________________ DRF ___________________________

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": (
        "apps.core.handlers.exception_handler"
    ),
    "NON_FILED_ERROR_KEY": (
        "non_field_errors"
    ),
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "apps.core.pagination.StandardResultsSetPagination",
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "apps.authorization.permissions.AppModelPermissions",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# ___________________________ JWT ___________________________

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": JWT_SECRET_KEY,
}

# ___________________________ LOGGING ___________________________

LOG_DIR = Path(os.getenv("LOG_DIR",BASE_DIR / "logs"))
LOG_DIR.mkdir(parents=True, exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": (
                "%(asctime)s [%(levelname)s] %(name)s | "
                "status=%(status)s code=%(code)s kind=%(kind)s "
                "user=%(user_id)s method=%(method)s path=%(path)s req_id=%(request_id)s | "
                "%(message)s"
            ),
            "datefmt": "%Y-%m-%dT%H:%M:%S%z"
        },
        "simple": {"format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"}
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
            "level": "INFO"
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
        },
        "app.errors": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "app.client": {
            "handlers": ["console"],
            "level": "INFO",
        },
    },
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

GRAPH_MODELS = {
    "all_applications": True,
    "group_models": True,
}

BYPASS_MODE=True