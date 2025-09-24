import pytest


@pytest.mark.django_db
def test_ldap_login_success(api_client, mocker, user):
    mock_auth = mocker.patch("django.contrib.auth.authenticate")
    mock_auth.return_value = user

    payload = {"username": "testuser", "password": "validpass"}
    response = api_client.post("/api/auth/login/", payload)

    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["username"] == "testuser"
