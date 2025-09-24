from apps.authentication.serializers import LoginSerializer


def test_login_serializer_valid():
    data = {"username": "testuser", "password": "strongpass"}
    serializer = LoginSerializer(data=data)
    assert serializer.is_valid()
