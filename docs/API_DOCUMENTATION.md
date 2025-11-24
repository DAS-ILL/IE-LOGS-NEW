# API Documentation

Complete API documentation for IE LOGS backend.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints require session-based authentication unless otherwise specified.

---

## Authentication Endpoints

### Login
**POST** `/api/auth/login/`

Request:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "team": "Engineering",
    "is_active": true,
    "created_at": "2023-12-15T10:00:00Z"
  }
}
```

### Logout
**POST** `/api/auth/logout/`

Response:
```json
{
  "message": "Logout successful"
}
```

### Get Current User
**GET** `/api/auth/me/`

Response:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "team": "Engineering",
  "is_active": true,
  "created_at": "2023-12-15T10:00:00Z"
}
```

---

## Project Endpoints

### Get My Projects
**GET** `/api/get-logs/`

Query Parameters:
- `page` (int): Page number
- `page_size` (int): Items per page
- `search` (string): Search text
- `project_status` (string): Filter by status
- `stage` (string): Filter by stage
- `completed_date_from` (date): Start date
- `completed_date_to` (date): End date

Response:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/get-logs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "completed_date": "2023-12-15",
      "application_number": "APP-001",
      "account_name": "Acme Corp",
      "project_court": "Phoenix Court",
      "reviewed_by": "John Doe",
      "project_status": "Approve",
      "stage": "Completed",
      "start_time": "2023-12-15T08:00:00-07:00",
      "end_time": "2023-12-15T17:00:00-07:00",
      "total_time": 9.0,
      "partner_installer_account": "Partner Inc",
      "third_party_salesforce": "YES",
      "comments": "All good",
      "content": "Project details",
      "is_new_learning": false,
      "created_by": 1,
      "created_by_username": "john_doe",
      "created_at": "2023-12-15T10:00:00-07:00",
      "updated_at": "2023-12-15T11:00:00-07:00",
      "is_deleted": false
    }
  ]
}
```

### Get Team Projects
**GET** `/api/get-team-projects/`

Same parameters and response as Get My Projects.

### Get Project Detail
**GET** `/api/get-log/{id}/`

Response: Single project object (see above).

### Save Draft
**POST** `/api/save-log/`

Request:
```json
{
  "completed_date": "2023-12-15",
  "application_number": "APP-002",
  "account_name": "Test Co",
  "project_court": "Tempe Court",
  "reviewed_by": "Jane Smith",
  "project_status": "Review",
  "start_time": "2023-12-15T08:00:00-07:00",
  "end_time": "2023-12-15T12:00:00-07:00",
  "comments": "Work in progress"
}
```

Response: Created/updated project object.

### Submit Project
**POST** `/api/submit-log/`

Request: Same as Save Draft (but requires all fields).

Response: Created/updated project object.

### Update Project
**PUT** `/api/update-log/{id}/`

Request: Project fields to update.

Response: Updated project object.

### Delete Project
**DELETE** `/api/delete-log/{id}/`

Response:
```json
{
  "message": "Project deleted successfully"
}
```

### Bulk Delete (Admin Only)
**POST** `/api/bulk-delete/`

Request:
```json
{
  "project_ids": [1, 2, 3]
}
```

Response:
```json
{
  "message": "Successfully deleted 3 project(s).",
  "deleted_count": 3
}
```

---

## Lookup & Filter Endpoints

### Get Lookup Data
**GET** `/api/lookup-data/`

Response:
```json
{
  "courts": ["Phoenix Court", "Tempe Court", "Mesa Court"],
  "reviewers": ["John Doe", "Jane Smith", "Bob Johnson"],
  "statuses": ["Approve", "Reject", "Review"],
  "third_party_options": ["YES", "NO"]
}
```

### Get Filter Options (My Projects)
**GET** `/api/filter-options/`

Response:
```json
{
  "courts": ["Phoenix Court", "Tempe Court"],
  "reviewers": ["John Doe", "Jane Smith"],
  "statuses": ["Approve", "Review"],
  "stages": ["Started", "Completed"]
}
```

### Get Team Filter Options
**GET** `/api/team-filter-options/`

Response:
```json
{
  "courts": ["Phoenix Court", "Tempe Court", "Mesa Court"],
  "reviewers": ["John Doe", "Jane Smith", "Bob Johnson"],
  "statuses": ["Approve", "Reject", "Review"],
  "stages": ["Started", "Completed"],
  "creators": [
    {"id": 1, "username": "john_doe"},
    {"id": 2, "username": "jane_smith"}
  ]
}
```

---

## Export Endpoints (Admin Only)

### Export Excel
**POST** `/api/export-excel/`

Request:
```json
{
  "start_date": "2023-01-01",
  "end_date": "2023-12-31",
  "project_ids": [1, 2, 3]
}
```

Response: Excel file (binary download)

### Export CSV
**POST** `/api/export-csv/`

Request: Same as Export Excel.

Response: CSV file (text download)

---

## User Management (Admin Only)

### List Users
**GET** `/api/auth/users/`

Response:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "team": "Engineering",
    "is_active": true,
    "created_at": "2023-12-15T10:00:00Z"
  }
]
```

### Create User
**POST** `/api/auth/users/`

Request:
```json
{
  "username": "new_user",
  "email": "newuser@example.com",
  "first_name": "New",
  "last_name": "User",
  "password": "secure123",
  "role": "user",
  "team": "Engineering",
  "is_active": true
}
```

Response: Created user object.

### Get User Detail
**GET** `/api/auth/users/{id}/`

Response: User object.

### Update User
**PUT** `/api/auth/users/{id}/`

Request: User fields to update.

Response: Updated user object.

### Delete User
**DELETE** `/api/auth/users/{id}/`

Response:
```json
{
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Timezone Handling

- All datetime fields in requests should be in **ISO 8601 format**
- Times are stored in **IST (Asia/Kolkata)** in the backend
- Times are returned in **MST (America/Phoenix)** in responses
- Frontend automatically handles timezone conversions

Example:
```json
{
  "start_time": "2023-12-15T08:00:00-07:00"  // MST
}
```

---

## Pagination

All list endpoints support pagination:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 50)

Response includes:
- `count`: Total items
- `next`: URL to next page
- `previous`: URL to previous page
- `results`: Array of items

---

## Filtering & Search

### Search
Use `search` parameter to search across multiple fields:
```
GET /api/get-logs/?search=APP-001
```

### Filtering
Use field-specific filters:
```
GET /api/get-logs/?project_status=Approve&stage=Completed
```

### Ordering
Use `ordering` parameter:
```
GET /api/get-logs/?ordering=-created_at  // Descending
GET /api/get-logs/?ordering=application_number  // Ascending
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production using Django REST Framework's throttling.

---

## CORS

CORS is enabled for the following origins (configurable in settings):
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Credentials (cookies) are allowed for session-based authentication.

---

## License
Proprietary - IE LOGS Application
