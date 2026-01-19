"""Developer Name: Javier Buil
Creation Date: 2025-03-01
Requirement Reference: MEDFDMD-47
Description: Utility functions.
"""

import os
import socket
from pathlib import Path

import django
import environ


def get_free_port() -> str:
    """Provide an available port between 1024 to 65535.

    Returns:
        str: Free Port

    """
    sock = socket.socket()
    sock.bind(("", 0))
    sock.getsockname()[1]
    return str(sock.getsockname()[1])


def setup_django(settings_module: str = "data_mining_project.settings.base"):
    """Set up Django for external scripts such as Jupyter Notebooks.

    Args:
        settings_module (str): The settings module to be used.

    """
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
    os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

    django.setup()


def set_django_settings_module(env_file=".env"):
    """Set django settings module environment variable
    from a .env file.

    Args:
        env_file (str, optional): Env file name. Defaults to ".env".

    """
    env = environ.Env()

    # Get base directory(parent of this file)
    BASE_DIR = Path(__file__).resolve().parent.parent.parent

    # Absolute path to the .env file
    env_path = BASE_DIR / env_file

    # Load the .env file if it exists
    if env_path.is_file():
        env.read_env(env_path)
    else:
        raise FileNotFoundError(f".env file not found. Paste the .env file in the following path: {BASE_DIR}")

    # Set django settings module if it's not already set
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE",
        env(
            "DJANGO_SETTINGS_MODULE",
            default="config.settings.local",
        ),
    )
