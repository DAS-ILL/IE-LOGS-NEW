#!/usr/bin/env python3
"""Add lookup data for courts and reviewers"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from projects.models import LookupData

# Add Project Court options
courts = ['New', 'Rereview-QSS', 'Rereview-Illuminei']
for court in courts:
    obj, created = LookupData.objects.get_or_create(
        lookup_type='court',
        value=court,
        defaults={'is_active': True}
    )
    if created:
        print(f'✓ Added court: {court}')
    else:
        print(f'- Court already exists: {court}')

# Add Reviewed By options
reviewers = [
    'Oliver T',
    'Guruprasath D',
    'Vignesh M',
    'Shivasubramanian K V',
    'Ganesh K',
    'Dhayanidhi Madhaiyan',
    'AHAMED FAHIM',
    'Harish S',
    'Dominic Xavier A',
    'Tawfeeq Hussain A',
    'HARISH VINAYAGAM B',
    'Abishek G',
    'Rahul Aravind',
    'P Surya Prakash',
    'Vigneshwaran S',
    'Ravisankar H'
]

for reviewer in reviewers:
    obj, created = LookupData.objects.get_or_create(
        lookup_type='reviewer',
        value=reviewer,
        defaults={'is_active': True}
    )
    if created:
        print(f'✓ Added reviewer: {reviewer}')
    else:
        print(f'- Reviewer already exists: {reviewer}')

court_count = LookupData.objects.filter(lookup_type='court', is_active=True).count()
reviewer_count = LookupData.objects.filter(lookup_type='reviewer', is_active=True).count()

print(f'\n=== Summary ===')
print(f'Total Active Courts: {court_count}')
print(f'Total Active Reviewers: {reviewer_count}')
