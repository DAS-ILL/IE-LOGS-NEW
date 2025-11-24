"""
Custom authentication classes for IE LOGS.
"""
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Session authentication without CSRF validation.
    Used for API endpoints where CSRF is handled differently or not needed.
    """
    
    def enforce_csrf(self, request):
        """
        Skip CSRF validation for API requests.
        """
        return  # Do nothing, effectively disabling CSRF
