"""
Custom User Model for IE LOGS
Supports admin and regular user roles with role-based permissions.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds role-based access control for admin/user distinction.
    """
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('team_lead', 'Team Lead'),
        ('user', 'User'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user',
        help_text='User role: admin (full access) or user (limited access)'
    )
    
    team = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Team name for team-based filtering'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user should be treated as active.'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        """Check if user has admin role."""
        return self.role == 'admin'
    
    @property
    def is_team_lead(self):
        """Check if user is a team lead."""
        return self.role == 'team_lead'
    
    def save(self, *args, **kwargs):
        """Override save to set is_staff for admin users."""
        if self.role == 'admin':
            self.is_staff = True
        super().save(*args, **kwargs)
