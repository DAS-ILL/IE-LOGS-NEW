# IE LOGS Backend (Django)

Django REST API backend for IE LOGS application.

## Features
- Django 4.2 with Django REST Framework
- MySQL database
- Session-based authentication
- Role-based access control (Admin/User)
- Timezone handling (IST storage, MST display)
- Soft delete for projects
- Advanced filtering and search
- Excel/CSV export
- CORS enabled for React frontend

## Setup

### Prerequisites
- Python 3.10+
- MySQL 8.0+
- pip and virtualenv

### Installation

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
copy .env.example .env
# Edit .env with your database credentials
```

4. Create MySQL database:
```sql
CREATE DATABASE ie_logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Load initial lookup data (optional):
```bash
python manage.py shell
```
```python
from projects.models import LookupData

# Add sample courts
courts = ['Court A', 'Court B', 'Court C']
for court in courts:
    LookupData.objects.create(lookup_type='court', value=court)

# Add sample reviewers
reviewers = ['Reviewer 1', 'Reviewer 2', 'Reviewer 3']
for reviewer in reviewers:
    LookupData.objects.create(lookup_type='reviewer', value=reviewer)
```

8. Run development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `GET/POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user
- `GET /api/auth/users/` - List users (admin only)
- `POST /api/auth/users/` - Create user (admin only)

### Projects
- `GET /api/get-logs/` - Get user's own projects
- `GET /api/get-team-projects/` - Get team projects
- `GET /api/get-log/<id>/` - Get project details
- `POST /api/submit-log/` - Submit/update project
- `POST /api/save-log/` - Save draft
- `PUT /api/update-log/<id>/` - Update project
- `DELETE /api/delete-log/<id>/` - Delete project
- `POST /api/bulk-delete/` - Bulk delete (admin only)

### Lookup & Filters
- `GET /api/lookup-data/` - Get dropdown options
- `GET /api/filter-options/` - Get filter options (My Projects)
- `GET /api/team-filter-options/` - Get filter options (Team Projects)

### Export
- `POST /api/export-excel/` - Export to Excel (admin only)
- `POST /api/export-csv/` - Export to CSV (admin only)

## Project Structure
```
backend/
├── config/              # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/            # User authentication app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── projects/            # Projects app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   └── urls.py
├── manage.py
└── requirements.txt
```

## Timezone Handling
- Backend stores all times in **IST (India Standard Time, UTC+5:30)**
- Frontend displays all times in **MST (Phoenix, Arizona, UTC-7)**
- Conversion handled automatically in serializers

## User Roles
- **Admin**: Full access to all projects and users
- **User**: Access to own projects and team projects

## Development

Run tests:
```bash
python manage.py test
```

Create migrations:
```bash
python manage.py makemigrations
```

Admin panel:
- URL: `http://localhost:8000/admin/`
- Login with superuser credentials

## Production Deployment

1. Set environment variables:
```bash
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<strong-secret-key>
DJANGO_ALLOWED_HOSTS=yourdomain.com
```

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Run with Gunicorn:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## License
Proprietary - IE LOGS Application
