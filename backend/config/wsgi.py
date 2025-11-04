"""
WSGI config for project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from apps.core.utils import set_django_settings_module
from django.core.wsgi import get_wsgi_application

# Set django settings module
set_django_settings_module()

application = get_wsgi_application()
