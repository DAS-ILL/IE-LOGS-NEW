# IE LOGS - Project Management System# IE LOGS (Django + React Monorepo)



A comprehensive project management and logging system built with Django REST Framework backend and React TypeScript frontend. The application manages project workflows with timezone-aware tracking (IST storage, MST display).This repository contains the next-generation IE LOGS application, migrated from Flask/HTML to Django (backend, MySQL) and React (frontend, Ant Design).



## 🚀 Features## Structure

- `backend/` – Django REST API, MySQL database

### Core Functionality- `frontend/` – React app with Ant Design UI  

- **Project Management**: Create, edit, and track projects with detailed information- `docs/` – Documentation, setup guides, API docs, and detailed migration logic (including dashboard/project UI/UX, filter logic, and all business rules for Django+React migration)

- **Dual-Stage Workflow**: Draft (Started) and Completed stages

- **Time Tracking**: Automatic calculation of project duration in whole minutes## Quick Start

- **Timezone Support**: Data stored in IST, displayed in MST (Mountain Standard Time)

- **Role-Based Access**: Admin and User roles with different permissions### Prerequisites

- Python 3.10+

### User Features- Node.js 18+

- Create and manage personal projects- MySQL 8.0+

- Save drafts before final submission- Docker & Docker Compose (optional)

- Auto-fill end time on submission

- View team projects (read-only)### Local Development

- Excel-style column filters

- Real-time total time calculation1. **Backend Setup**:

```bash

### Admin Featurescd backend

- View and manage all projectspython -m venv venv

- Delete projects from within modalvenv\Scripts\activate  # Windows

- Bulk delete multiple projectspip install -r requirements.txt

- Export projects to Excel/CSV with date range filterscp .env.example .env

- Override time tracking fields# Edit .env with your database credentials

- Manage user accountspython manage.py migrate

python manage.py createsuperuser

### UI/UX Highlightspython manage.py runserver

- **Two-column form layout** for better space utilization```

- **Stage badges** (Green: Completed, Orange: Started)

- **Conditional Project Status**: Includes "Conditional Approve" option2. **Frontend Setup**:

- **Redline checkbox** for special project marking```bash

- **No scrolling modals** - Wider form (1200px) shows all fieldscd frontend

- **Quick export presets**: Last Month, Last 3 Months, Last 6 Monthsnpm install

- **Whole number minutes** display (no decimals)cp .env.example .env

- **Clickable rows** to edit projectsnpm run dev

```

## 📋 Tech Stack

3. **Access**:

### Backend- Frontend: http://localhost:3000

- **Django 4.2** - Web framework- Backend API: http://localhost:8000/api/

- **Django REST Framework** - API development- Django Admin: http://localhost:8000/admin/

- **PostgreSQL 16** - Database

- **pytz** - Timezone handling### Docker Deployment

- **openpyxl** - Excel export

- **python-dotenv** - Environment management```bash

- **Gunicorn** - WSGI servercp .env.example .env

# Edit .env with production values

### Frontenddocker-compose up -d --build

- **React 18** - UI frameworkdocker-compose exec backend python manage.py migrate

- **TypeScript** - Type safetydocker-compose exec backend python manage.py createsuperuser

- **Vite 5.4** - Build tool```

- **Ant Design 5** - UI components

- **Axios** - HTTP clientAccess at http://localhost

- **Zustand** - State management

- **dayjs** - Date/time manipulation## Documentation

- **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Complete setup and deployment guide

### Infrastructure- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - Full API reference

- **Docker & Docker Compose** - Containerization- **[FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md)** - Feature specifications and business logic

- **Nginx** - Web server (frontend on port 8080)- **[MIGRATION_PLAN.md](docs/MIGRATION_PLAN.md)** - Migration strategy and checklist

- **PostgreSQL** - Database (port 5432)- **[backend/README.md](backend/README.md)** - Backend documentation

- **[frontend/README.md](frontend/README.md)** - Frontend documentation

## 🛠️ Installation & Setup

## Getting Started

### PrerequisitesSee [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for complete setup instructions.

- Docker Desktop installed

- Git installed## Migration Requirements & Step-by-Step Process

- Node.js 18+ (for local development)

- Python 3.11+ (for local development)This project is a tech stack migration of IE LOGS from Flask/HTML/SQL Server to Django (MySQL) and React (Ant Design), preserving all features and business logic. No new features are added in this phase.



### Quick Start (Production)### Requirements

- All current features, workflows, and business rules must be preserved (see docs/FEATURE_MATRIX.md).

1. **Clone the repository**- UI/UX must match or improve upon the legacy app (see dashboard, modal, filter, and export logic).

```bash- All times in UI and exports must be shown in MST (Phoenix, Arizona), backend stores IST (+12.5hr offset).

git clone https://github.com/DAS-ILL/IE-LOGS-NEW.git- Admin and user roles, permissions, and workflows must be maintained.

cd IE-LOGS-NEW- All endpoints, filters, and exports must be mapped and tested for parity.

```

### Migration Steps

2. **Create environment file**1. **Document Legacy Features:**

```bash   - Completed in docs/FEATURE_MATRIX.md and MIGRATION_PLAN.md.

# Copy the example file2. **Scaffold Monorepo:**

cp .env.example .env   - backend/ (Django + MySQL), frontend/ (React + Ant Design), docs/ (documentation).

3. **Preserve Legacy Code:**

# Edit .env and set your values:   - Old Flask/HTML code remains in the original folder for reference.

# - POSTGRES_PASSWORD4. **Backend Setup:**

# - DJANGO_SECRET_KEY   - Initialize Django project, configure MySQL, create models matching legacy DB.

# - DJANGO_DEBUG (set to False for production)   - Implement Django REST API endpoints mapped from Flask (see FEATURE_MATRIX.md).

```5. **Frontend Setup:**

   - Initialize React app with Ant Design, scaffold dashboard, forms, modals, and filters.

3. **Build and start containers**   - Implement all UI/UX as documented.

```bash6. **Integrate & Test:**

docker-compose up -d --build   - Connect frontend to backend APIs, test all workflows (create, edit, save draft, submit, filter, export, etc.).

```   - Validate timezone handling, permissions, and feature parity.

7. **Documentation:**

4. **Wait for services to be ready** (30-60 seconds)   - Update docs/ with any migration notes, API changes, or edge cases found.

8. **Review & Handover:**

5. **Create superuser (admin account)**   - Ensure all requirements are met, documentation is complete, and team is ready to continue development.

```bash

# Windows PowerShell:---

.\create-superuser.ps1

Refer to docs/FEATURE_MATRIX.md for all business logic, UI/UX, and API details. This README and docs/ are your single source of truth for the migration.

# Linux/Mac:
chmod +x create-superuser.sh
./create-superuser.sh
```

6. **Access the application**
- **Frontend**: http://192.168.0.223:8080
- **Backend API**: http://192.168.0.223:8000/api
- **Admin Panel**: http://192.168.0.223:8000/admin

### Initial Setup

After first deployment:
1. Login as admin user
2. Create regular user accounts via Admin Panel
3. Populate lookup data (courts, reviewers, etc.)

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database Configuration
POSTGRES_DB=ie_logs_db
POSTGRES_USER=ie_logs_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django Configuration
DJANGO_SECRET_KEY=your_django_secret_key_here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=192.168.0.223,localhost,127.0.0.1

# Timezone Settings
TIME_ZONE=Asia/Kolkata  # IST - DO NOT CHANGE
USE_TZ=True
```

### Important Notes
- **DO NOT change TIME_ZONE** - System designed for IST storage, MST display
- Keep `USE_TZ=True` for proper timezone handling
- Set `DJANGO_DEBUG=False` in production

## 📁 Project Structure

```
IE-LOGS-NEW/
├── backend/                 # Django backend
│   ├── accounts/           # User authentication
│   ├── config/             # Django settings
│   ├── projects/           # Main project app
│   │   ├── models.py      # Database models
│   │   ├── serializers.py # API serializers (timezone conversion)
│   │   ├── views.py       # API endpoints
│   │   └── migrations/    # Database migrations
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard/
│   │   │       ├── ProjectModal.tsx      # Create/Edit form
│   │   │       ├── MyProjectsTab.tsx     # User's projects
│   │   │       ├── TeamProjectsTab.tsx   # All projects (admin)
│   │   │       └── ExportModal.tsx       # Export functionality
│   │   ├── services/
│   │   │   └── api.ts                    # API calls
│   │   ├── utils/
│   │   │   └── timezone.ts               # Timezone utilities
│   │   ├── store/
│   │   │   └── authStore.ts              # Auth state
│   │   └── pages/
│   │       ├── Login.tsx
│   │       └── Dashboard.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docs/                   # Documentation
│   ├── FEATURE_MATRIX.md
│   └── MIGRATION_PLAN.md
│
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment template
├── .gitignore
└── README.md
```

## 🔄 Development Workflow

### Local Development (Backend)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Local Development (Frontend)

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Making Changes

1. **Backend changes**: Restart backend container
```bash
docker-compose restart backend
```

2. **Frontend changes**: Rebuild containers
```bash
docker-compose up -d --build
```

3. **Database changes**: Create and run migrations
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

## 📊 Database Schema

### Project Model (Main Table)

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key (auto) |
| application_number | String | Required, unique identifier |
| account_name | String | Customer/account name |
| project_court | String | Court selection |
| reviewed_by | String | Reviewer name |
| project_status | String | Approve/Conditional Approve/Reject/Review |
| stage | String | Started/Completed |
| start_time | DateTime | Start timestamp (IST) |
| end_time | DateTime | End timestamp (IST) |
| total_time | Integer | Duration in whole minutes |
| completed_date | Date | Auto-set on submission |
| partner_installer_account | String | Partner info |
| third_party_salesforce | String | YES/NO |
| comments | Text | Additional notes |
| content | Text | Project content |
| is_new_learning | Boolean | Learning flag |
| is_redline | Boolean | Redline flag |
| created_by | ForeignKey | User who created |
| created_at | DateTime | Record creation (UTC) |
| updated_at | DateTime | Last update (UTC) |
| is_deleted | Boolean | Soft delete flag |

## 🎯 Key Features Explained

### Timezone Handling
- **Storage**: All times stored in IST (Asia/Kolkata) or UTC
- **Display**: All times shown in MST (America/Phoenix)
- **Conversion**: Backend serializer converts on API response
- **Frontend**: Direct string extraction prevents browser timezone issues

### Time Tracking
- **Auto Start**: Start time auto-filled on first field entry
- **Auto End**: End time auto-filled on Submit
- **Total Time**: Automatically calculated as whole minutes (60, 61, 300)
- **Admin Override**: Admins can manually edit times

### Project Workflow
1. User creates project → Stage: "Started" (draft)
2. User can Save Draft multiple times
3. User clicks Submit → Stage: "Completed", completed_date auto-set
4. Completed projects: Only Save/Cancel buttons (no re-submission)

### Export Functionality (Admin Only)
- Export to Excel (.xlsx) or CSV
- Date range filters with time
- Quick presets: Last Month, Last 3 Months, Last 6 Months
- Exports all project fields

## 🔐 User Roles & Permissions

### Admin
- ✅ View all projects
- ✅ Edit any project
- ✅ Delete projects (from modal or bulk)
- ✅ Export projects
- ✅ Override time fields
- ✅ Access admin panel

### User
- ✅ Create own projects
- ✅ Edit own projects
- ✅ View team projects (read-only)
- ✅ Save drafts
- ❌ Cannot delete projects
- ❌ Cannot export
- ❌ Cannot edit others' projects

## 🐛 Troubleshooting

### Frontend not loading
```bash
# Check if containers are running
docker-compose ps

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Backend errors
```bash
# Check backend logs
docker-compose logs backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Database connection issues
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Port conflicts
If ports 8080, 8000, or 5432 are in use:
1. Stop conflicting services
2. Or edit `docker-compose.yml` to use different ports

## 📦 Deployment

### Production Checklist
- [ ] Set `DJANGO_DEBUG=False` in .env
- [ ] Change `DJANGO_SECRET_KEY` to random secure value
- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS certificates (recommended)
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and logging

### Pulling Latest Changes

```bash
# Stop containers
docker-compose down

# Pull latest code
git pull origin main

# Rebuild and start
docker-compose up -d --build

# Run any new migrations
docker-compose exec backend python manage.py migrate
```

### Backup & Restore

**Backup Database:**
```bash
docker-compose exec db pg_dump -U ie_logs_user ie_logs_db > backup_$(date +%Y%m%d).sql
```

**Restore Database:**
```bash
docker-compose exec -T db psql -U ie_logs_user ie_logs_db < backup_20251124.sql
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

## 📝 Recent Changes (Nov 2025)

### Latest Enhancements
- ✅ Wider modal (1200px) - no scrolling needed
- ✅ Total time as whole minutes only
- ✅ Fixed timezone display issues (created_at now correct in MST)
- ✅ Removed Search fields (use column filters)
- ✅ Removed Actions column (click row to edit)
- ✅ Delete button moved inside modal (admin only)
- ✅ Export with date/time pickers and presets
- ✅ Completed date consistency fixes
- ✅ Bulk delete always visible at top right

### Bug Fixes
- Fixed created_at showing IST instead of MST
- Fixed total_time discrepancy between modal and table
- Fixed completed_date timezone conversion
- Fixed Redline checkbox not saving
- Fixed admin save error on completed projects

## 📞 Support

For issues or questions:
1. Check this README first
2. Check troubleshooting section
3. Review Docker logs
4. Contact system administrator

## 📄 License

Proprietary - DAS-ILL Internal Use Only

---

**Version**: 2.0 (November 2025)  
**Last Updated**: November 24, 2025  
**Maintained By**: DAS-ILL Development Team
