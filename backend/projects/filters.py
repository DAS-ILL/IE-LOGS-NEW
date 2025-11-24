"""
Django filters for Project model.
"""
from django_filters import rest_framework as filters
from .models import Project


class ProjectFilter(filters.FilterSet):
    """Filter for Project queryset."""
    
    application_number = filters.CharFilter(lookup_expr='icontains')
    account_name = filters.CharFilter(lookup_expr='icontains')
    project_court = filters.CharFilter(lookup_expr='exact')
    reviewed_by = filters.CharFilter(lookup_expr='exact')
    project_status = filters.CharFilter(lookup_expr='exact')
    stage = filters.CharFilter(lookup_expr='exact')
    created_by = filters.NumberFilter(field_name='created_by__id')
    completed_date_from = filters.DateFilter(field_name='completed_date', lookup_expr='gte')
    completed_date_to = filters.DateFilter(field_name='completed_date', lookup_expr='lte')
    created_at_from = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_at_to = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Project
        fields = [
            'application_number', 'account_name', 'project_court',
            'reviewed_by', 'project_status', 'stage', 'created_by'
        ]
