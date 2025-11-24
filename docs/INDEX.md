# IE LOGS Documentation Index

Welcome to the IE LOGS project documentation. This index will help you find the information you need.

## 📖 Documentation Structure

### Getting Started
1. **[README.md](../README.md)** - Project overview and quick start
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands, ports, common tasks
3. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions for local and production

### Technical Documentation
4. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full API reference with examples
5. **[FEATURE_MATRIX.md](FEATURE_MATRIX.md)** - Feature specifications and business logic
6. **[MIGRATION_PLAN.md](MIGRATION_PLAN.md)** - Migration strategy and checklist

### Project Information
7. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project summary and status
8. **[Backend README](../backend/README.md)** - Backend-specific documentation
9. **[Frontend README](../frontend/README.md)** - Frontend-specific documentation

## 🎯 Find What You Need

### I want to...

#### **Get Started Quickly**
→ Go to [QUICK_REFERENCE.md](QUICK_REFERENCE.md)  
Quick commands, ports, and common tasks

#### **Set Up the Application**
→ Go to [SETUP_GUIDE.md](SETUP_GUIDE.md)  
Step-by-step setup for local development and production

#### **Understand the API**
→ Go to [API_DOCUMENTATION.md](API_DOCUMENTATION.md)  
Complete API reference with request/response examples

#### **Learn About Features**
→ Go to [FEATURE_MATRIX.md](FEATURE_MATRIX.md)  
All features, business logic, and workflows

#### **Understand the Migration**
→ Go to [MIGRATION_PLAN.md](MIGRATION_PLAN.md)  
Migration strategy from Flask to Django/React

#### **See What's Been Built**
→ Go to [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)  
Complete project status and what was created

#### **Work on Backend**
→ Go to [Backend README](../backend/README.md)  
Django-specific documentation

#### **Work on Frontend**
→ Go to [Frontend README](../frontend/README.md)  
React-specific documentation

## 📋 Quick Links by Topic

### Authentication & Users
- User roles: [FEATURE_MATRIX.md#user-roles](FEATURE_MATRIX.md#1-user-roles)
- Auth API: [API_DOCUMENTATION.md#authentication-endpoints](API_DOCUMENTATION.md#authentication-endpoints)
- User management: [SETUP_GUIDE.md#user-management](SETUP_GUIDE.md#user-management)

### Projects
- Project fields: [FEATURE_MATRIX.md#project-fields](FEATURE_MATRIX.md#6-detailed-dashboard-modal-save-draft-and-filter-logic)
- Project API: [API_DOCUMENTATION.md#project-endpoints](API_DOCUMENTATION.md#project-endpoints)
- CRUD operations: [FEATURE_MATRIX.md#core-workflows](FEATURE_MATRIX.md#8-core-workflows)

### Dashboard & UI
- Dashboard features: [FEATURE_MATRIX.md#dashboard-project-display](FEATURE_MATRIX.md#6-detailed-dashboard-modal-save-draft-and-filter-logic)
- Filter logic: [FEATURE_MATRIX.md#filter-options--logic](FEATURE_MATRIX.md#6-detailed-dashboard-modal-save-draft-and-filter-logic)
- Export functionality: [FEATURE_MATRIX.md#export](FEATURE_MATRIX.md#6-detailed-dashboard-modal-save-draft-and-filter-logic)

### Timezone
- Timezone handling: [FEATURE_MATRIX.md#timezone](FEATURE_MATRIX.md#6-detailed-dashboard-modal-save-draft-and-filter-logic)
- API timezone info: [API_DOCUMENTATION.md#timezone-handling](API_DOCUMENTATION.md#timezone-handling)

### Deployment
- Local setup: [SETUP_GUIDE.md#local-development-setup](SETUP_GUIDE.md#local-development-setup)
- Docker deployment: [SETUP_GUIDE.md#docker-deployment](SETUP_GUIDE.md#docker-deployment)
- Production: [SETUP_GUIDE.md#production-deployment](SETUP_GUIDE.md#production-deployment)

## 🔧 Development Resources

### Backend (Django)
- Models: `backend/accounts/models.py`, `backend/projects/models.py`
- Views: `backend/projects/views.py`
- Serializers: `backend/projects/serializers.py`
- URLs: `backend/config/urls.py`, `backend/projects/urls.py`

### Frontend (React)
- Components: `frontend/src/components/Dashboard/`
- Pages: `frontend/src/pages/`
- API Service: `frontend/src/services/api.ts`
- Types: `frontend/src/types/index.ts`

### Configuration
- Backend env: `backend/.env.example`
- Frontend env: `frontend/.env.example`
- Docker: `docker-compose.yml`
- Django settings: `backend/config/settings.py`

## 📚 Recommended Reading Order

### For New Developers
1. [README.md](../README.md) - Project overview
2. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - What's been built
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands
4. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions
5. [FEATURE_MATRIX.md](FEATURE_MATRIX.md) - Feature details

### For Frontend Developers
1. [Frontend README](../frontend/README.md)
2. [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. [FEATURE_MATRIX.md](FEATURE_MATRIX.md)

### For Backend Developers
1. [Backend README](../backend/README.md)
2. [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. [FEATURE_MATRIX.md](FEATURE_MATRIX.md)

### For DevOps
1. [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. [docker-compose.yml](../docker-compose.yml)
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### For Project Managers
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. [FEATURE_MATRIX.md](FEATURE_MATRIX.md)
3. [MIGRATION_PLAN.md](MIGRATION_PLAN.md)

## 🆘 Need Help?

### Common Issues
→ [SETUP_GUIDE.md#troubleshooting](SETUP_GUIDE.md#troubleshooting)

### API Questions
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### Feature Questions
→ [FEATURE_MATRIX.md](FEATURE_MATRIX.md)

### Quick Commands
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

## 📝 Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| README.md | ✅ Complete | Current |
| QUICK_REFERENCE.md | ✅ Complete | Current |
| SETUP_GUIDE.md | ✅ Complete | Current |
| API_DOCUMENTATION.md | ✅ Complete | Current |
| FEATURE_MATRIX.md | ✅ Complete | Current |
| MIGRATION_PLAN.md | ✅ Complete | Current |
| PROJECT_SUMMARY.md | ✅ Complete | Current |
| Backend README | ✅ Complete | Current |
| Frontend README | ✅ Complete | Current |

---

**Note**: All documentation is current as of the initial scaffolding. Update as needed during development.

## 📞 Support

For questions or issues:
1. Check the relevant documentation above
2. Review the troubleshooting section
3. Consult the quick reference guide
4. Review the API documentation for endpoint details

---

**Happy Coding! 🚀**
