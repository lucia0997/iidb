import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def user(db):
    return User.objects.create_user(username="testuser", password="strongpass")


@pytest.fixture
def api_client():
    return APIClient()
