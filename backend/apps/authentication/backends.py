from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from .ldap_service import ldap_service

# Get User Model
User = get_user_model()
# Retrieve server domain name
ROOT_PATH = settings.ROOT_PATH

class LDAPAuthenticationBackend(ModelBackend):
    """
    Custom authentication backend that manages the authentication process via LDAP. 
    """

    def authenticate(self, request, **credentials):
        """
        Authenticate against the Airbus Active Directory
        """

        username = credentials.get("username", None)
        password = credentials.get("password", None)

        # Authentication requires a username and a password
        if not username or not password:
            return None
        
        # Bypass admin user authentication
        if username == "admin":
            try: 
                # Attempt to get the user from the DB
                user = User.objects.get(username=username)
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
                else: 
                    return None
            except Exception as e:
                return None

        # Authenticate against LDAP 
        if not ldap_service.authenticate_user(username, password):
            return None
        
        # Fetch local active user
        try:
            user = User.objects.get(username=username)
        except:
            return None
        
        # Authentication checks (is_Active = true)
        if not self.user_can_authenticate(user):
            return None
        return user