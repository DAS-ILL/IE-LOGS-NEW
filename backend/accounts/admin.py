from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'team', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'team', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'team']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'team')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'team')}),
    )
