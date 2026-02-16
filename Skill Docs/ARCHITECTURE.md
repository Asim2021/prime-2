# ERP System Architecture

## Project Structure

erp-project/
├── ERPB/ # Backend: Express.js API (Node.js + JavaScript)
└── ERPF/ # Frontend: React SPA (TypeScript + Vite)

## Backend Architecture

### Core Principles

- **Pattern**: Feature-based modular structure (not strict MVC)
- **Language**: Plain JavaScript (no TypeScript)
- **Error Handling**: Centralized via global error middleware
- **Validation**: Joi schemas per feature, applied via validation middleware
- **Tooling**: Custom script `npm run feature:create` auto-generates feature folders

### Key Directories (`ERPB/src/`)

```js
├── features/ # Feature modules (auth, user, items, etc.)
│ ├── auth/ # auth.controller.js, auth.service.js, auth.router.js, auth.schema.js
│ └── v1.js # Aggregates all feature routers under /api/v1
├── models/ # Sequelize models (e.g., users/user.model.js)
├── middleware/ # Auth, error, validation, logger
├── lib/ # Helpers: mail, redis, config, rate limiting
├── config/ # Database, environment, logger setup
├── utils/ # Reusable utilities (Joi validator, helpers)
├── common/ # Shared constants & schemas (joiSchema.js)
├── app.js # Express app setup
└── server.js # HTTP server initialization
```

### Database

- **Type**: MySQL
- **ORM**: Sequelize
- **Primary Key**: UUID v4 string (`id`)
- **Timestamps**: `createdAt`, `updatedAt` (auto-managed)
- **Naming**: camelCase for tables and columns
- **Migrations**: Managed via Sequelize CLI
- **Soft Delete**: Not used by default

### Authentication

- **Strategy**: JWT access + refresh tokens
- **Access Token**: Sent in header as `Authorization: Bearer <token>`
- **Refresh Token**: Stored in HTTP-only cookie
- **Session Policy**: Refresh tokens must exist in the sessions table and be active; session `expiresAt` is enforced and `lastActive` is updated on refresh. Access tokens are validated by JWT only.
- **Role Authorization**: Middleware enforces `allowedRoles` check
- **User Payload**: Password excluded; role details joined via Sequelize

### API Conventions

- **Base Path**: `/api/v1`
- **Success Response**:
    ```json
    { "success": true, "data": ..., "message": "...", "severity": "success" }
    ```
- **Error Response**:
    ```json
    { "success": false, "data": ..., "message": "...", "severity": "error" }
    ```

### New Module creation

When adding a new module:

1. Run:
    ```bash
    npm run feature:create [moduleName]
    ```
2. Create model → define schema → add associations
3. Implement controller + router + validation(Joi)

## Frontend Architecture

### Core Principles

- State Management:
    - Server state → TanStack Query (@tanstack/react-query)
    - Client state → Zustand stores
- UI Library: Mantine (with custom wrappers in components/)
- Tables: Reusable <MainTable /> component built on TanStack Table v8
- API Layer: Service functions + usePaginationDataFetch hook
- Routing: File-based pages under pages/ with dedicated routers
- Modal Management: Add Zustand store for modal state (if needed)
- Register route in MainRouter.tsx and sidebar

### Key Directories (ERPF/src/)

```js
├── pages/           # Route compositions (Auth/, Users/, Items/, etc.)
├── components/      # Shared UI: Modal, Sidebar, ERPSelect, PageLoader
├── services/        # API service functions (userService.ts, authService.ts)
├── hooks/           # Custom hooks (e.g., usePaginationDataFetch.ts)
├── stores/          # Zustand global state stores
├── lib/             # Axios instance with interceptors
├── utils/           # Validators, formatters, notifications, helpers
├── types/           # TypeScript interfaces and types
├── constants/       # App-wide constants (endpoints, strings, etc.)
├── mantineStyles/   # Custom Mantine theme overrides
├── App.tsx          # Main app layout
└── main.tsx         # Entry point
```

### Data Flow

- Component calls custom hook (e.g., usePaginationDataFetch())
- Hook uses TanStack Query + service function (getUsers() from `src/services/userService.ts`)
- Service executes Axios request to backend endpoint
- Response is cached, deduplicated, and managed by React Query
