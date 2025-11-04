import ldap3
from typing import Optional, List, Dict
from django.conf import settings
from django_python3_ldap.conf import settings as ldap_settings
from ldap3.utils.conv import escape_filter_chars
from ldap3.core.exceptions import LDAPExceptionError


class LDAPService:
    """
    Service for handling LDAP authentication and user creation
        > Checking existence
        > Fetching attributes
        > Validating credentials
    """
    def _server(self) -> ldap3.Server:
        return ldap3.Server(ldap_settings.LDAP_AUTH_URL)
    
    def _bind_root(self) -> ldap3.Connection:
        print(f"{settings.LDAP_COUNTRY_DOMAIN}\\{settings.LDAP_AUTH_BIND_DN}")
        try:
            return ldap3.Connection(
                    self._server(),
                    user=f"{settings.LDAP_COUNTRY_DOMAIN}\\{settings.LDAP_AUTH_BIND_DN}",
                    password=settings.LDAP_AUTH_BIND_PASSWORD,
                    auto_bind=True,
                )
               
        except Exception as e:
            print("Error with LDAP Credentials: ", e)
            return None

    def _bind_user(self, user_dn: str, password: str) -> bool: # revisar al refactorizar el login de usuario
        try:
            with ldap3.Connection(
                    self._server(),
                    user=user_dn,
                    password=password,
                    auto_bind=True
                ):
                return True
        except Exception as e:
            return False
        
    def _user_filter(self, username: str) -> str:
        username = escape_filter_chars(username)
        uid_attr = ldap_settings.LDAP_AUTH_USER_FIELDS["username"]
        return (
             f"(&(objectClass={ldap_settings.LDAP_AUTH_OBJECT_CLASS})"
             f"({uid_attr}={username}))"
        )
    
    def _search_user(self, username:str, attributes: Optional[List[str]] = None) -> List[ldap3.Entry]:
        try:
            with self._bind_root() as conn:
                conn.search(
                    search_base=ldap_settings.LDAP_AUTH_SEARCH_BASE,
                    search_filter=self._user_filter(username),
                    search_scope=ldap3.SUBTREE, 
                    attributes=attributes or ldap3.ALL_ATTRIBUTES
                )
                return conn.entries
        except LDAPExceptionError as e:
            return []
        
    def user_exists(self, username: str) -> bool:
        """
        Check if a user exists in the AAD directory via the root LDAP user.
        """
        return bool(self._search_user(username))
    
    def fetch_user_attributes(self, username: str, attributes: Optional[List[str]] = None) -> Optional[Dict[str, List[str]]]:
        """
        Fetch user attributes from the AAD directory via the root LDAP user.
        """
        entries = self._search_user(username, attributes=attributes or ldap3.ALL_ATTRIBUTES)
        return entries[0].entry_attributes_as_dict if entries else None
            
    def authenticate_user(self, username:str, password:str) -> bool:
        """
        Validate the credentials against LDAP:
            - Search user into the AD and get user dn
            - Connect to the server with the user credentials and bind check
        """
        print(f"LDAP_COUNTRY_DOMAIN: {settings.LDAP_COUNTRY_DOMAIN}{username}")
        return self._bind_user(user_dn=f"{settings.LDAP_COUNTRY_DOMAIN}\\{username}", password=password)
        
ldap_service = LDAPService()