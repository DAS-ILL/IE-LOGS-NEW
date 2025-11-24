from rest_framework import serializers
from django.utils import timezone
import pytz
from .models import Project, LookupData
from accounts.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model.
    Handles timezone conversion from IST (storage) to MST (display).
    """
    
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'completed_date', 'application_number', 'account_name',
            'project_court', 'reviewed_by', 'project_status', 'stage',
            'start_time', 'end_time', 'total_time',
            'partner_installer_account', 'third_party_salesforce',
            'comments', 'content', 'is_new_learning', 'is_redline',
            'created_by', 'created_by_username', 'created_by_detail',
            'created_at', 'updated_at', 'is_deleted'
        ]
        read_only_fields = ['id', 'total_time', 'created_at', 'updated_at', 'created_by']
    
    def to_representation(self, instance):
        """Convert times from IST/UTC to MST for display."""
        data = super().to_representation(instance)
        
        # Convert datetime fields to MST
        mst_tz = pytz.timezone('America/Phoenix')
        
        # created_at and updated_at are stored in UTC (Django default with USE_TZ=True)
        # Direct conversion from model instance fields (already timezone-aware)
        if instance.created_at:
            data['created_at'] = instance.created_at.astimezone(mst_tz).isoformat()
        
        if instance.updated_at:
            data['updated_at'] = instance.updated_at.astimezone(mst_tz).isoformat()
        
        # start_time and end_time are stored in IST - convert from model instance
        if instance.start_time:
            data['start_time'] = instance.start_time.astimezone(mst_tz).isoformat()
        
        if instance.end_time:
            data['end_time'] = instance.end_time.astimezone(mst_tz).isoformat()
        
        return data


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating projects.
    Converts times from MST (input) to IST (storage).
    completed_date, start_time, end_time are auto-set by system.
    """
    
    class Meta:
        model = Project
        fields = [
            'completed_date', 'application_number', 'account_name',
            'project_court', 'reviewed_by', 'project_status', 'stage',
            'start_time', 'end_time',
            'partner_installer_account', 'third_party_salesforce',
            'comments', 'content', 'is_new_learning', 'is_redline'
        ]
        # These fields are auto-set and cannot be manually edited by users
        read_only_fields = []  # Will be controlled by frontend for regular users
    
    def validate(self, data):
        """Validate project data."""
        # For partial updates (editing existing project), need to check instance values
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        # If this is a partial update and we don't have both times in data, get from instance
        if self.instance:
            if not start_time and self.instance.start_time:
                start_time = self.instance.start_time
            if not end_time and self.instance.end_time:
                end_time = self.instance.end_time
        
        # Check if end_time is after start_time (only if both are present)
        if end_time and start_time:
            # Ensure both are timezone-aware for comparison
            if timezone.is_naive(start_time):
                start_time = timezone.make_aware(start_time)
            if timezone.is_naive(end_time):
                end_time = timezone.make_aware(end_time)
                
            if end_time <= start_time:
                raise serializers.ValidationError({
                    'end_time': 'End time must be after start time.'
                })
        
        return data
    
    def to_internal_value(self, data):
        """Convert times from MST (input) to IST (storage)."""
        internal_data = super().to_internal_value(data)
        
        # Convert datetime fields from MST to IST
        mst_tz = pytz.timezone('America/Phoenix')
        ist_tz = pytz.timezone('Asia/Kolkata')
        
        for field in ['start_time', 'end_time']:
            if internal_data.get(field):
                dt = internal_data[field]
                # If naive, assume it's MST
                if timezone.is_naive(dt):
                    mst_dt = mst_tz.localize(dt)
                else:
                    mst_dt = dt.astimezone(mst_tz)
                # Convert to IST
                ist_dt = mst_dt.astimezone(ist_tz)
                internal_data[field] = ist_dt
        
        return internal_data


class LookupDataSerializer(serializers.ModelSerializer):
    """Serializer for LookupData model."""
    
    class Meta:
        model = LookupData
        fields = ['id', 'lookup_type', 'value', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class BulkDeleteSerializer(serializers.Serializer):
    """Serializer for bulk delete operations."""
    
    project_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
        help_text='List of project IDs to delete'
    )
