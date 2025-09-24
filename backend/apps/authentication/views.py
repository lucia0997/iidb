from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MeSerializer, LoginSerializer


class MeView(RetrieveAPIView):
    """
    Retrieves the user information
    """
    permission_classes = [AllowAny]
    serializer_class = MeSerializer

    def get_object(self):
        return self.request.user
    
class LoginView(TokenObtainPairView):
    """
    Authenticates a user via LDAP and returns JWT tokens.
    """
    serializer_class = LoginSerializer
    #permission_classes = [AllowAny] ya incluido en TokenObtainPairView


