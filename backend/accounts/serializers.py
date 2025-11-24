from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
import logging

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'team', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        logger.info(f"Validating login for username: {username}")
        
        if username and password:
            user = authenticate(username=username, password=password)
            logger.info(f"Authentication result for {username}: {user}")
            if user:
                if not user.is_active:
                    logger.warning(f"User {username} is not active")
                    raise serializers.ValidationError('User account is disabled.')
                data['user'] = user
            else:
                logger.error(f"Authentication failed for username: {username}")
                raise serializers.ValidationError('Invalid username or password.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')
        
        return data


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users (admin only)."""
    
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'role', 'team', 'is_active']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'user'),
            team=validated_data.get('team', ''),
            is_active=validated_data.get('is_active', True),
        )
        return user
