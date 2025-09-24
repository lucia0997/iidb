import getpass

from django.conf import settings
from django.test import TestCase

from users.utils import ldap_user


class LdapUserIntegrationTestCase(TestCase):
    """Integration test case for the ldap_user function."""

    def test_ldap_user_with_logged_in_user(self):
        """
        Test the ldap_user function using the current Windows logged-in user and
        actual Django LDAP settings.

        This test validates whether the ldap_user function can successfully
        connect to the LDAP server using the configuration defined in Django
        settings. It uses the current Windows logged-in user as input to check
        if the user exists in the LDAP directory.

        Preconditions:
            - LDAP settings (e.g., LDAP_AUTH_URL, LDAP_AUTH_BIND_DN, etc.)
              must be correctly configured in the Django project's settings file.
            - The test environment must have network access to the LDAP server.

        Steps:
            1. Fetch the current Windows logged-in username using getpass.getuser().
            2. Verify that all required LDAP settings are defined in settings.
            3. Call the ldap_user function with the fetched username.
            4. Assert that the function returns a valid LDAP user object (if the user exists).
            5. If the user does not exist, assert that the function returns None.

        Assertions:
            - Ensure all required LDAP settings are present in settings.
            - Validate that the returned LDAP user object contains the expected
              attributes (e.g., sAMAccountName) if the user exists.
            - If the user does not exist, ensure the function returns None.

        Raises:
            AssertionError: If any of the required LDAP settings are missing
            or the function's return value does not match the expected outcome.
        """
        # Get the current Windows logged-in username
        windows_user = getpass.getuser()

        # Ensure that LDAP settings are correctly configured
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_URL"),
            "LDAP_AUTH_URL is not defined in Django settings.",
        )
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_BIND_DN"),
            "LDAP_AUTH_BIND_DN is not defined in Django settings.",
        )
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_BIND_PASSWORD"),
            "LDAP_AUTH_BIND_PASSWORD is not defined in Django settings.",
        )
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_OBJECT_CLASS"),
            "LDAP_AUTH_OBJECT_CLASS is not defined in Django settings.",
        )
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_SEARCH_BASE"),
            "LDAP_AUTH_SEARCH_BASE is not defined in Django settings.",
        )
        self.assertTrue(
            hasattr(settings, "LDAP_AUTH_USER_FIELDS"),
            "LDAP_AUTH_USER_FIELDS is not defined in Django settings.",
        )

        # Run the ldap_user function
        result = ldap_user(windows_user)

        # Check if the LDAP user was found and returned correctly
        if result:
            print("LDAP user found:", result)

            # Validate key attributes of the returned user object
            self.assertIn("sAMAccountName", result.entry_attributes_as_dict)
            self.assertEqual(result.entry_attributes_as_dict["sAMAccountName"][0], windows_user)
        else:
            # If no user is found, ensure the function returned None
            print("No LDAP user found for the current Windows user:", windows_user)
            self.assertIsNone(result)
