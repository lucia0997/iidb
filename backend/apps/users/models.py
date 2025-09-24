"""
Developer Name: Javier Buil
Creation Date: 2024-04-01
Requirement Reference: MEDFDMD-3
Description: Custom User Model
"""

import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    full_name = models.CharField(max_length=128, null=True, blank=True)
    #is_onboarded = models.BooleanField(default=False)  # Launches onboarding tour
    #avatar       = models.ImageField(upload_to='abatars/', null=True, blank=True)

    class Meta(AbstractUser.Meta):
        managed = True
        swappable = "AUTH_USER_MODEL"
        ordering = ["username"]
        permissions = [
            ("view_users", "Can view the users data for all users."),
            ("edit_users", "Can create, edit, delete the data for all users, and view the groups."),
        ]

    def save(self, *args, **kw):
        self.full_name = f"{self.first_name} {self.last_name}"
        super().save(*args, **kw)
