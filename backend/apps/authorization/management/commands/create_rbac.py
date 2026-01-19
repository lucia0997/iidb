from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.management import CommandError

from apps.authorization.groups import GROUP_MATRIX

User = get_user_model()

class Command(BaseCommand):
    """Synchronize groups and permissions with the GROUP_MATRIX definition."""

    help = "Create default RBAC user groups and assign permissions."

    def handle(self, *args, **kwargs):
        self.stdout.write("🛠 Syncronising groups ...")

        with transaction.atomic():
            # Ensure ADMIN permission exists associated to the user model
            user_ct = ContentType.objects.get_for_model(User)
            Permission.objects.get_or_create(
                codename = "admin",
                defaults = {
                    "name": "Site Administrator",
                    "content_type": user_ct
                }
            )

            # Detect non-existing groups (groups asigned to users in the database that are not defined in the GROUP_MATRIX)
            groups = set(GROUP_MATRIX.keys())
            groups_trim = Group.objects.exclude(name__in=groups).filter(user__isnull=False).distinct()

            if groups_trim.exists():
                offenders = [f"{group.name} ({group.user_set.count()} users)" for group in groups_trim]
                raise CommandError(
                    "❗ The following groups exist in the database assigned to users, but are not defined in GROUP_MATRIX:"
                    f"{', '.join(offenders)}"
                    "Assign the users to a different group or add them to the matrix before syncing."
                )

            # Validate that every explicit permission code exists in the DB
            permission_codes = {code for group in GROUP_MATRIX.values() for code in group['permissions'] if code not in {'*', 'admin'}}
            existing_codes = set(Permission.objects.filter(codename__in=permission_codes).values_list("codename", flat=True))
            missing_codes = permission_codes - existing_codes
            if missing_codes:
                raise CommandError(
                    "❗ GROUP_MATRIX references permission codenames that do no exist in the database:"
                    f"{', '.join(sorted(missing_codes))}"
                    "Define them into their corresponding models, and create them via migrations before running this command."
                )

            # Synchronize groups with the group-permission correspondance defined in the matrix
            for group_name, group_data in GROUP_MATRIX.items():
                group, created = Group.objects.get_or_create(name = group_name)
                action = "✔ Created" if created else "🔄 Updated"
                self.stdout.write(f"{action} group: {group_name}")

                # Clear existing group permissions and assign new ones
                group.permissions.clear()
                group.permissions.set(Permission.objects.all() if "*" in group_data.get('permissions') else Permission.objects.filter(codename__in=group_data.get('permissions')))
                group.save()

            self.stdout.write(self.style.SUCCESS("✔ Groups synchronised."))


