from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Runs environment setup: migrate, create RBAC, admin, and fake users"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Running migrate..."))
        call_command("migrate")

        self.stdout.write(self.style.NOTICE("Creating RBAC permissions..."))
        call_command("create_rbac")

        self.stdout.write(self.style.NOTICE("Creating admin user..."))
        call_command("create_admin_user")

        self.stdout.write(self.style.NOTICE("Creating fake users..."))
        call_command("create_fake_users")

        self.stdout.write(self.style.SUCCESS("Environment setup complete."))
