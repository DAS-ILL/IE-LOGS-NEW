# Migration Plan: Flask/HTML to Django + React (Ant Design)

## 1. Project Overview
- Migrate IE LOGS from Flask (Python, SQL Server, Jinja2, Bootstrap, JS) to Django (Python, MySQL) and React (Ant Design).
- Preserve all current features, business logic, and workflows.
- No new features in this phase—focus on tech stack migration and UI/UX parity.

## 2. Key Features to Preserve
- User authentication (session-based, roles: admin/user)
- Dashboard: project listing, advanced filtering, search, pagination
- Dashboard: project listing (admin: all, user: My/Team tabs), advanced filtering (quick/advanced, client-side and API), search, pagination
- Project details modal: full field view/edit, admin can edit/delete all, users can edit/save/submit their own drafts
- Save draft: minimal required fields, drafts shown as 'Started', can be edited/submitted later
- Filter logic: quick search, advanced modal, My Projects filters user’s data, Team Projects filters all team data, backend APIs for dropdowns
- Export: admin can export all projects (Excel/CSV) with date range and all columns
- Timezone: all times in UI/exports are MST (Phoenix), backend stores IST with +12.5hr offset
## 6. Project Fields (Form & Modal)

All project fields (for create/edit/view):
- Completed Date (required, date)
- Application Number (required, text)
- Account Name (required, text)
- Project Court (required, dropdown)
- Reviewed By (required, dropdown)
- Project Status (required, dropdown: Approve, Reject, Review)
- Start Time (required, datetime-local, MST)
- End Time (optional, datetime-local, MST)
- Total Time (auto-calculated, display only)
- Partner Installer Account (optional, text)
- Third Party Salesforce (optional, dropdown: YES/NO)
- Comments (optional, textarea)
- Content (optional, textarea)
- Is New Learning (optional, checkbox)

All fields are shown in the project details modal. Editable if draft and user is owner/admin. Admins can always edit/delete. Users can only edit their own drafts.
- Bulk actions: bulk delete, export
- Project CRUD (create, read, update, delete/soft delete)
- Team vs My Projects filtering
- Dropdowns: dynamic filter options (user/team)
- REST API endpoints for all data operations
- Error handling, status messages, and notifications
- Responsive UI (desktop/mobile)
- Deployment scripts and configuration

## 3. Migration Checkpoints
- [ ] Document all current endpoints, models, and workflows
- [ ] Map Flask routes to Django REST API endpoints
- [ ] Map Jinja2 templates/UI to React components (AntD)
- [ ] Recreate all filters, dropdowns, and bulk actions in React
- [ ] Implement MySQL models and migrations in Django
- [ ] Implement authentication and session management in Django
- [ ] Test all business logic for parity with old app
- [ ] Prepare deployment scripts for Django + React
- [ ] Write migration/transition guide for users

## 4. Reference
- Legacy code and logic are preserved in the old project folder for reference during migration.
- All new code and documentation will be in ie-logs-new/.

---

Update this file as you progress through the migration. This is your single source of truth for migration logic and checkpoints.
