from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base class that adds created_at and updated_at fields to models."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class SoftDeleteModel(TimeStampedModel):
    """Abstract base class that overrides the model delete method to perform soft deletes"""

    is_deleted = models.BooleanField(default=False)
    objects = models.Manager()
    undeleted_objects = SoftDeleteManager()

    def delete(self):
        self.is_deleted = True
        self.save()

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        abstract = True
