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
    full_name = models.CharField(max_length=128, blank=True, default="", editable=False, db_index=True)
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
    
    def __str__(self) -> str:
        return self.username

    def save(self, *args, **kw):
        # Calculate and normalize full_name on each save
        fn = (self.first_name or "").strip()
        ln = (self.last_name or "").strip()
        self.full_name = f"{fn} {ln}".strip()
        super().save(*args, **kw)