# Feature Matrix: IE LOGS Migration

## 1. User Roles
- **Admin**: Full access to all projects, users, and admin-only actions.
- **User**: Access to own projects, limited team/project actions.

---

## 2. Features by Role

| Feature                        | User | Admin | Notes |
|--------------------------------|------|-------|-------|
| Login/Logout                   |  ✔   |   ✔   | Session-based authentication |
| Dashboard: My Projects         |  ✔   |   ✔   | Shows only projects created by user |
| Dashboard: Team Projects       |  ✔   |   ✔   | Shows all team projects (admin: all users, user: team only) |
| Advanced Filtering             |  ✔   |   ✔   | By status, date, created by, etc. |
| Search (Quick/Advanced)        |  ✔   |   ✔   | Search by project name, fields |
| Pagination                     |  ✔   |   ✔   | |
| Project Create                 |  ✔   |   ✔   | |
| Project Edit                   |  ✔   |   ✔   | Users: only own projects; Admin: any project |
| Project Delete (Soft Delete)   |  ✔   |   ✔   | Users: only own; Admin: any |
| Bulk Delete                    |  ✔   |   ✔   | Admin: all; User: only own/team |
| Export Projects                |  ✔   |   ✔   | CSV/Excel export |
| Team Filter Dropdown           |  ✔   |   ✔   | Admin: all users; User: team only |
| Created By Filter Dropdown     |  ✔   |   ✔   | Contextual (My/Team) |
| Status/Type Filter Dropdown    |  ✔   |   ✔   | |
| Error/Status Notifications     |  ✔   |   ✔   | |
| Admin Panel/Settings           |      |   ✔   | User management, system settings |
| User Management                |      |   ✔   | Add/edit/remove users |
| Audit Logs                     |      |   ✔   | View all actions |
| Deployment/Config Scripts      |      |   ✔   | |

---

## 3. Special Logic & Business Rules
- **Soft Delete**: Projects are not removed from DB, only marked as deleted.
- **Dropdowns**: Filter options change based on My Projects/Team Projects and user role.
- **Bulk Actions**: Only allowed on visible/accessible projects.
- **Session Handling**: Session-based auth, role-based access control.
- **Error Handling**: User-friendly messages for all actions.

---

## 4. UI/UX Behaviors
- Responsive design (desktop/mobile)
- Loading indicators for API calls
- Confirmation dialogs for delete/bulk actions
- Contextual dropdowns and filters
- Clear separation of My Projects vs Team Projects

---

## 5. Reference
- Update this file as you discover more features or edge cases during migration.
- Use this as a checklist for feature parity in Django + React.

---

## 6. Detailed Dashboard, Modal, Save Draft, and Filter Logic

### Dashboard Project Display
- **Admin:** Table with Application #, Account Name, Project Court, Reviewed By, Status, Stage, Total Time, Date, Created By.
- **User:** Two tabs—My Projects (own), Team Projects (all team).
- Clicking a row opens a modal with full project details.
- Admins can edit/save/submit/delete any project. Users can edit/save/submit their own drafts.

### Save Draft Logic
- Users can save a draft with minimal required fields (Application #, etc.).
- Drafts are stored as 'Started' and can be edited/submitted later.
- Only owner or admin can edit/submit.

### Filter Options & Logic
- Quick search filters (text, dropdowns, date) for all main columns.
- Advanced filter modal (admin) with multi-select checkboxes.
- My Projects filters only user’s data; Team Projects filters all team data.
- Filtering is client-side for visible data, with backend APIs for dropdown options.

### Project Details Modal
- Shows all project fields. Editable if user is owner/admin and project is a draft.
- Admins can always edit/delete; users can only edit their own drafts.

### Export
- Admins can export all projects (Excel/CSV) with full details and date range filtering.
- Exported columns match dashboard table and include all project fields.

### Timezone
- All times in UI and exports are shown in MST (Phoenix, Arizona).
- Backend stores times in IST with +12.5 hour offset for correct display.

### Project Fields (Form & Modal)
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

---

## 7. Key API Endpoints (Flask → Django Reference)

### Authentication
- `POST /login` – User login
- `GET /logout` – User logout

### Dashboard & Data
- `GET /dashboard` – Main dashboard (admin/user logic)
- `GET /api/get-logs` – Get user’s own logs (My Projects)
- `GET /api/get-team-projects` – Get all team projects (Team Projects tab)
- `GET /api/get-log/<log_id>` – Get details for a specific log (My Projects)
- `GET /api/get-team-project-detail/<log_id>` – Get details for a team project

### Project CRUD
- `POST /api/submit-log` – Submit or update a project log (create or update)
- `POST /api/save-log` – Save a project log as draft
- `PUT /api/update-log/<log_id>` – Update a log (admin/owner)
- `DELETE /api/delete-log/<log_id>` – Delete a log (admin only)
- `POST /api/bulk-delete` – Bulk delete logs (admin only)

### Lookup & Filter Data
- `GET /api/lookup-data` – Get dropdown data (courts, reviewers, statuses)
- `GET /api/filter-options` – Get filter dropdowns for My Projects
- `GET /api/team-filter-options` – Get filter dropdowns for Team Projects

### Export & Integration
- `POST /api/export-excel` – Export selected logs to Excel
- `POST /api/export-data` – Export all logs (admin, Excel/CSV, date range)
- `POST /api/push-to-crm` – Push log to CRM (future integration)

---

## 8. Core Workflows

### Project Creation (User/Admin)
1. User clicks “New Project Entry”
2. Fills required fields (see Project Fields above)
3. Can save as draft (minimal fields) or submit (all required fields)
4. Drafts appear as “Started”; submitted projects as “Completed”

### Project Edit/Submit
- Users can edit/save/submit their own drafts
- Admins can edit/save/submit/delete any project
- Submitted projects are locked for users (admin can still edit)

### Dashboard Interaction
- Click row to view/edit project in modal
- Bulk select for delete (admin)
- Quick and advanced filters for searching
- Export (admin) with date range and all columns

### Filtering
- Quick search: text, dropdowns, date (client-side)
- Advanced filter modal (admin): multi-select checkboxes
- Filter options loaded from backend APIs

### Timezone Handling
- All times shown in MST (Phoenix, Arizona)
- Backend stores times in IST (+12.5hr offset)
- All exports and UI display use MST

---

Update this section as you migrate endpoints to Django REST and React, ensuring all workflows and API contracts are preserved.
