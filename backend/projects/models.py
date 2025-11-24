"""
Project models for IE LOGS application.
Includes all fields from legacy Flask app with timezone handling (IST storage, MST display).
"""
from django.db import models
from django.conf import settings
from django.utils import timezone


class Project(models.Model):
    """
    Main Project/Log model with all fields from legacy system.
    Times stored in IST, displayed in MST (Phoenix, Arizona).
    """
    
    STATUS_CHOICES = [
        ('Approve', 'Approve'),
        ('Conditional Approve', 'Conditional Approve'),
        ('Reject', 'Reject'),
        ('Review', 'Review'),
    ]
    
    STAGE_CHOICES = [
        ('Started', 'Started'),  # Draft/in-progress
        ('Completed', 'Completed'),  # Submitted
    ]
    
    THIRD_PARTY_CHOICES = [
        ('YES', 'YES'),
        ('NO', 'NO'),
    ]
    
    # Required fields
    completed_date = models.DateField(
        null=True,
        blank=True,
        help_text='Project completion date (auto-set on submit)'
    )
    
    application_number = models.CharField(
        max_length=100,
        help_text='Unique application identifier'
    )
    
    account_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Customer/account name'
    )
    
    project_court = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Project court/location'
    )
    
    reviewed_by = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Reviewer name'
    )
    
    project_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        blank=True,
        null=True,
        help_text='Approval status'
    )
    
    start_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Project start time (auto-set when application number entered, stored in IST, displayed in MST)'
    )
    
    # Optional fields
    end_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Project end time (auto-set on submit, stored in IST, displayed in MST)'
    )
    
    total_time = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Total time in hours (auto-calculated)'
    )
    
    partner_installer_account = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Partner installer account name'
    )
    
    third_party_salesforce = models.CharField(
        max_length=3,
        choices=THIRD_PARTY_CHOICES,
        blank=True,
        null=True,
        help_text='Third party Salesforce integration'
    )
    
    comments = models.TextField(
        blank=True,
        null=True,
        help_text='Additional comments'
    )
    
    content = models.TextField(
        blank=True,
        null=True,
        help_text='Project content/description'
    )
    
    is_new_learning = models.BooleanField(
        default=False,
        help_text='Flag for new learning projects'
    )
    
    is_redline = models.BooleanField(
        default=False,
        help_text='Redline flag'
    )
    
    # Stage/Status tracking
    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        default='Started',
        help_text='Project stage: Started (draft) or Completed (submitted)'
    )
    
    # Audit fields
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        help_text='User who created this project'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Record creation timestamp'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Last update timestamp'
    )
    
    # Soft delete
    is_deleted = models.BooleanField(
        default=False,
        help_text='Soft delete flag'
    )
    
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Deletion timestamp'
    )
    
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_projects',
        help_text='User who deleted this project'
    )
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_by', '-created_at']),
            models.Index(fields=['stage', '-created_at']),
            models.Index(fields=['project_status', '-created_at']),
            models.Index(fields=['is_deleted']),
        ]
    
    def __str__(self):
        return f"{self.application_number} - {self.account_name}"
    
    def save(self, *args, **kwargs):
        """Auto-calculate total time if start and end times are provided."""
        if self.start_time and self.end_time:
            time_diff = self.end_time - self.start_time
            self.total_time = round(time_diff.total_seconds() / 60)  # Convert to whole minutes
        super().save(*args, **kwargs)
    
    def soft_delete(self, user):
        """Soft delete the project."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save()


class LookupData(models.Model):
    """
    Lookup data for dropdowns (courts, reviewers, etc.).
    Allows dynamic management of dropdown options.
    """
    
    LOOKUP_TYPES = [
        ('court', 'Project Court'),
        ('reviewer', 'Reviewed By'),
    ]
    
    lookup_type = models.CharField(
        max_length=50,
        choices=LOOKUP_TYPES,
        help_text='Type of lookup data'
    )
    
    value = models.CharField(
        max_length=255,
        help_text='Lookup value'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this option is active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lookup_data'
        unique_together = ['lookup_type', 'value']
        ordering = ['lookup_type', 'value']
    
    def __str__(self):
        return f"{self.get_lookup_type_display()}: {self.value}"
