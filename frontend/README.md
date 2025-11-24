# IE LOGS Frontend (React + Ant Design)

React frontend application for IE LOGS project management system.

## Features
- React 18 with TypeScript
- Ant Design UI components
- Vite for fast development
- Zustand for state management
- Axios for API calls
- Day.js for timezone handling (MST display)
- Session-based authentication
- Role-based UI (Admin/User)

## Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment:
```bash
copy .env.example .env
# Edit .env if needed (default: http://localhost:8000)
```

3. Run development server:
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000/`

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── Dashboard/
│   │       ├── MyProjectsTab.tsx
│   │       ├── TeamProjectsTab.tsx
│   │       ├── ProjectModal.tsx
│   │       └── ExportModal.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts                # API service layer
│   ├── store/
│   │   └── authStore.ts          # Auth state management
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── api.ts                # Axios client config
│   │   └── timezone.ts           # Timezone utilities (MST)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## Features by Page

### Login Page
- Username/password authentication
- Session-based login with cookies
- Automatic redirect if already logged in

### Dashboard
**My Projects Tab:**
- View user's own projects
- Search and filter by application #, account name, court, reviewer
- Edit own drafts
- Delete own projects
- Pagination

**Team Projects Tab:**
- View all team projects (admin: all, user: team only)
- Search and filter
- Edit own drafts (admin: edit any)
- Bulk delete (admin only)
- Pagination

**Project Modal:**
- Create new project
- Edit existing project (if owner/admin and draft)
- Save as draft (minimal validation)
- Submit project (full validation)
- Auto-calculate total time
- All fields with proper validation
- Timezone: MST display, IST storage (automatic)

**Export Modal (Admin Only):**
- Export to Excel or CSV
- Date range filtering
- All columns included
- Times shown in MST

## Timezone Handling
- All times displayed in **MST (Phoenix, Arizona)**
- Backend stores in **IST (India Standard Time)**
- Automatic conversion handled in API layer
- Use `formatDateTime()` and `toMST()` utilities

## User Roles
- **Admin**: Full access, can edit/delete any project, bulk operations, export
- **User**: Own projects + team projects view, edit own drafts only

## API Integration
- Base URL: `http://localhost:8000` (configurable in `.env`)
- Session-based auth with credentials
- Auto-redirect to login on 401 errors
- See `src/services/api.ts` for all API calls

## Development

Build for production:
```bash
npm run build
# Output in dist/
```

Preview production build:
```bash
npm run preview
```

## Key Libraries
- **React Router**: Client-side routing
- **Ant Design**: UI component library
- **Axios**: HTTP client
- **Zustand**: State management
- **Day.js**: Date/time handling with timezone support
- **TypeScript**: Type safety

## Environment Variables
- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:8000)

## Authentication Flow
1. User logs in via `/login`
2. Session cookie stored by browser
3. All API calls include credentials
4. Auth state managed in Zustand store
5. Protected routes redirect to login if not authenticated

## Deployment

### Build
```bash
npm run build
```

### Serve with Nginx/Apache
Serve the `dist/` folder and configure reverse proxy to backend API.

Example Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## License
Proprietary - IE LOGS Application
