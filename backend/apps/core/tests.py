from backend.apps.core.mixins import LoginAndPermissionRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.test import TestCase
from django.urls import URLPattern, URLResolver, get_resolver
from django.views.generic import RedirectView
from rest_framework.views import APIView


class TestLoginAndPermissionRequiredMixinViewInheritance(TestCase):
    """Test that all class-based views in the application inherit from
    LoginAndPermissionRequiredMixin.

    This ensures that access to all views is properly protected and requires
    both login and necessary permissions. API views are not tested in this
    class as the protection is already centralized in settings.py under
    DEFAULT_PERMISSION_CLASSES.
    """

    def test_all_views_inherit_login_and_permission_required(self):
        """Verify that all views in the project inherit from the
        LoginAndPermissionRequiredMixin.

        This test dynamically inspects all URL patterns in the project, identifies
        class-based views, and checks if they inherit the required mixin. If any
        view does not inherit from LoginAndPermissionRequiredMixin, the test will
        fail with a list of the problematic views.

        Steps:
            1. Retrieve all URL patterns using Django's URL resolver.
            2. Filter class-based views from the URL callbacks.
            3. Check if each class-based view is a subclass of
               LoginAndPermissionRequiredMixin.
            4. Collect and report errors for views that do not meet the requirement.

        Raises:
            AssertionError: If one or more views do not inherit from
            LoginAndPermissionRequiredMixin.

        """
        resolver = get_resolver()
        view_functions = extract_views_from_patterns(resolver.url_patterns)

        errors = []
        for view_func in view_functions:
            # Check if the view is a class-based view
            if hasattr(view_func, "view_class"):
                view_class = view_func.view_class
                # Exclude Django's built-in RedirectView, DRF's APIView,
                # Login and Logout views
                if issubclass(view_class, (RedirectView, APIView, LoginView, LogoutView)):
                    continue
                # Inspect the base classes of the view
                if not issubclass(view_class, LoginAndPermissionRequiredMixin):
                    errors.append(f"{view_class.__name__} CBV")

        if errors:
            self.fail("The following views do not inherit LoginAndPermissionRequiredMixin:\n" + "\n".join(errors))


def extract_views_from_patterns(patterns):
    """Recursively extract all view functions from a list of URL patterns.

    Args:
        patterns (list): A list of URLPattern and URLResolver objects.

    Returns:
        list: A list of view callback functions.

    """
    views = []

    for pattern in patterns:
        if isinstance(pattern, URLPattern):  # Simple URL pattern
            views.append(pattern.callback)
        elif isinstance(pattern, URLResolver):  # Nested URL resolver
            views.extend(extract_views_from_patterns(pattern.url_patterns))  # Recurse into nested patterns

    return views
