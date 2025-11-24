from django.contrib import admin
from .models import Project, LookupData


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin interface for Project model."""
    
    list_display = [
        'application_number', 'account_name', 'project_court', 
        'reviewed_by', 'project_status', 'stage', 'total_time',
        'created_by', 'created_at', 'is_deleted'
    ]
    
    list_filter = [
        'stage', 'project_status', 'is_deleted', 'created_at',
        'project_court', 'reviewed_by'
    ]
    
    search_fields = [
        'application_number', 'account_name', 'project_court',
        'reviewed_by', 'created_by__username'
    ]
    
    readonly_fields = ['created_at', 'updated_at', 'deleted_at', 'total_time']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('completed_date', 'application_number', 'account_name')
        }),
        ('Project Details', {
            'fields': ('project_court', 'reviewed_by', 'project_status', 'stage')
        }),
        ('Time Tracking', {
            'fields': ('start_time', 'end_time', 'total_time')
        }),
        ('Additional Information', {
            'fields': (
                'partner_installer_account', 'third_party_salesforce',
                'comments', 'content', 'is_new_learning'
            )
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
        ('Deletion Information', {
            'fields': ('is_deleted', 'deleted_at', 'deleted_by')
        }),
    )


@admin.register(LookupData)
class LookupDataAdmin(admin.ModelAdmin):
    """Admin interface for LookupData model."""
    
    list_display = ['lookup_type', 'value', 'is_active', 'created_at']
    list_filter = ['lookup_type', 'is_active']
    search_fields = ['value']
