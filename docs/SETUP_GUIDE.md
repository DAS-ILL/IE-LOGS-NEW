# Setup Guide: IE LOGS Application

Complete setup guide for deploying the IE LOGS application (Django + React monorepo).

## Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (optional, for containerized deployment)

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd ie-logs-new
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment
```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

Edit `.env` file with your database credentials:
```env
DB_NAME=ie_logs
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

#### Create Database
```sql
CREATE DATABASE ie_logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Run Migrations
```bash
python manage.py makemigrations accounts
python manage.py makemigrations projects
python manage.py migrate
```

#### Create Superuser
```bash
python manage.py createsuperuser
```

#### Load Sample Data (Optional)
```bash
python manage.py shell
```
```python
from projects.models import LookupData

# Add courts
courts = ['Phoenix Court', 'Tempe Court', 'Mesa Court', 'Scottsdale Court']
for court in courts:
    LookupData.objects.get_or_create(lookup_type='court', value=court)

# Add reviewers
reviewers = ['John Doe', 'Jane Smith', 'Bob Johnson']
for reviewer in reviewers:
    LookupData.objects.get_or_create(lookup_type='reviewer', value=reviewer)

print("Sample data loaded!")
exit()
```

#### Run Development Server
```bash
python manage.py runserver
```
Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
# or
yarn install
```

#### Configure Environment
```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

The default configuration points to `http://localhost:8000` for the backend.

#### Run Development Server
```bash
npm run dev
# or
yarn dev
```
Frontend will be available at `http://localhost:3000`

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

Login with the superuser credentials you created.

---

## Docker Deployment

### 1. Configure Environment
```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

Edit `.env` with production values:
```env
DJANGO_SECRET_KEY=your-super-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com
DB_PASSWORD=secure-password
```

### 2. Build and Run
```bash
docker-compose up -d --build
```

### 3. Run Migrations
```bash
docker-compose exec backend python manage.py migrate
```

### 4. Create Superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 5. Access Application
- **Frontend**: http://localhost
- **Backend**: http://localhost:8000

### 6. Stop Services
```bash
docker-compose down
```

---

## Production Deployment

### Backend (Django)

1. **Set Environment Variables**:
```bash
export DJANGO_SECRET_KEY="your-strong-secret-key"
export DJANGO_DEBUG=False
export DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
export DB_NAME="ie_logs"
export DB_USER="ieuser"
export DB_PASSWORD="secure-password"
export DB_HOST="your-db-host"
```

2. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run Migrations**:
```bash
python manage.py migrate
```

4. **Collect Static Files**:
```bash
python manage.py collectstatic --noinput
```

5. **Run with Gunicorn**:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Frontend (React)

1. **Build**:
```bash
npm run build
```

2. **Serve with Nginx**:

Create `/etc/nginx/sites-available/ie_logs`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://localhost:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/backend/media/;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ie_logs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## User Management

### Create Admin User
```bash
python manage.py createsuperuser
```
Enter username, email, and password.

Then update the user's role in Django admin or shell:
```python
from accounts.models import User
user = User.objects.get(username='admin')
user.role = 'admin'
user.save()
```

### Create Regular User
Via Django Admin (`http://localhost:8000/admin/accounts/user/add/`) or API:
```bash
curl -X POST http://localhost:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "secure123",
    "role": "user",
    "team": "Engineering"
  }'
```

---

## Troubleshooting

### Backend Issues

**Database Connection Error**:
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

**Import Errors**:
- Activate virtual environment
- Run `pip install -r requirements.txt`

**Migration Errors**:
- Delete migration files (except `__init__.py`)
- Run `python manage.py makemigrations`
- Run `python manage.py migrate`

### Frontend Issues

**Module Not Found**:
- Delete `node_modules/`
- Run `npm install` again

**API Connection Error**:
- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Check CORS settings in backend

**Build Errors**:
- Clear cache: `npm run build -- --force`
- Check TypeScript errors

---

## Maintenance

### Backup Database
```bash
mysqldump -u root -p ie_logs > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u root -p ie_logs < backup_20231215.sql
```

### Update Dependencies

Backend:
```bash
pip install --upgrade -r requirements.txt
```

Frontend:
```bash
npm update
```

---

## Support

For issues or questions, refer to:
- `README.md` - Project overview
- `docs/FEATURE_MATRIX.md` - Feature specifications
- `docs/MIGRATION_PLAN.md` - Migration details
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

---

## License
Proprietary - IE LOGS Application
