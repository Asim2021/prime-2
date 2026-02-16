# Environment Setup

## Prerequisites
- Node.js `^24`
- npm `^11`
- MySQL `8+`

## Backend (ERPB)

### 1) Install dependencies
```
cd ERPB
npm install
```

### 2) Configure environment
Copy `ERPB/.env.example` to `ERPB/.env` and update:
- `SQL_*` for MySQL connection
- `REDIS_*` for Redis connection
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ENCRYPTION_SECRET`
- `SMTP_*` and `FROM_EMAIL` for email
- `PORT` (default `5001`)

### 3) Database
Create the MySQL database defined by `SQL_DATABASE_NAME`.

### 4) Migrations + seeds
```
npm run db:init
```

### 5) Run backend
```
npm run dev
```

## Frontend (ERPF)

### 1) Install dependencies
```
cd ERPF
npm install
```

### 2) Environment
No `ERPF/.env.example` is present. The frontend uses the Vite dev server proxy:
- `proxy` is set to `http://localhost:5001` in `ERPF/package.json`
- Ensure backend is running on that port

### 3) Run frontend
```
npm run dev
```

## Service Checks
- Backend: `http://localhost:5001/api/v1` should respond
- Frontend: Vite dev server output will show the local URL

