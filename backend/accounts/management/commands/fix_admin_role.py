from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Fix admin user role'

    def handle(self, *args, **options):
        try:
            admin = User.objects.get(username='admin')
            self.stdout.write(f'Current role: {admin.role}')
            
            if admin.role != 'admin':
                admin.role = 'admin'
                admin.save()
                self.stdout.write(self.style.SUCCESS('✓ Admin role updated to "admin"'))
            else:
                self.stdout.write(self.style.SUCCESS('✓ Admin role is already correct'))
                
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('✗ Admin user not found'))
