#!/usr/bin/env python3
# Fix admin role checks in views.py

with open('/opt/ie-logs/backend/projects/views.py', 'r') as f:
    content = f.read()

# Replace is_admin with role == 'admin'
content = content.replace('user.is_admin', "user.role == 'admin'")
content = content.replace('request.user.is_admin', "request.user.role == 'admin'")

with open('/opt/ie-logs/backend/projects/views.py', 'w') as f:
    f.write(content)

print('Fixed admin checks in views.py')
