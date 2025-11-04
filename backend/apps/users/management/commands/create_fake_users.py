import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from faker import Faker

N_USERS = 50
FAKE_PASSWORD = "1234"


class Command(BaseCommand):
    help = "Create N_USERS fake users bypassing LDAP authentication"

    def handle(self, *args, **options):
        fake = Faker()
        User = get_user_model()

        users_to_create = []
        for _ in range(N_USERS):
            username = fake.unique.user_name()
            email = fake.email()
            user = User(
                username=username,
                email=email,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
            )
            user.set_password(FAKE_PASSWORD)
            users_to_create.append(user)

        User.objects.bulk_create(users_to_create, batch_size=100)
        self.stdout.write(self.style.SUCCESS(f"Successfully created {N_USERS} fake users."))
