from apps.users.models import User
from apps.authorization.groups import ADMINISTRATOR_GROUP
from django.conf import settings
from django.contrib.auth.models import Group
from django.core.exceptions import ImproperlyConfigured
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates an admin user and assigns it to the Administrator group."

    ADMIN_USERNAME = "admin"

    def handle(self, *args, **kwargs):
        try:
            password = self._get_admin_password()
            user = self._get_or_create_admin_user(password)
            group = self._get_administrator_group()
            if group:
                self._assign_user_to_group(user, group)
        except ImproperlyConfigured as e:
            self.stderr.write(str(e))

    def _get_admin_password(self):
        """Fetch admin password from settings."""
        password = getattr(settings, "ADMIN_PASSWORD", None)
        if not password:
            raise ImproperlyConfigured("Environment variable 'ADMIN_PASSWORD' is not set.")
        return password

    def _get_or_create_admin_user(self, password):
        """Retrieve existing admin user or create a new one."""
        user, created = User.objects.get_or_create(
            username=self.ADMIN_USERNAME, defaults={"password": password, "is_superuser": True, "is_staff": True}
        )
        if created:
            user.set_password(password)  # Ensure password is hashed
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Admin user '{user.username}' created."))
        else:
            self.stdout.write(self.style.WARNING(f"User '{user.username}' already exists."))
        return user

    def _get_administrator_group(self):
        """Retrieve the Administrator group, if it exists."""
        group = Group.objects.filter(name=ADMINISTRATOR_GROUP).first()
        if not group:
            self.stdout.write(
                self.style.WARNING(
                    f"Group '{ADMINISTRATOR_GROUP}' does not exist. Please run the 'create_rbac' management command first."
                )
            )
            return None
        return group

    def _assign_user_to_group(self, user, group):
        """Assign user to the specified group."""
        if group not in user.groups.all():
            user.groups.add(group)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"User '{user.username}' added to '{group.name}' group."))
        else:
            self.stdout.write(self.style.WARNING(f"User '{user.username}' is already in the '{group.name}' group."))
