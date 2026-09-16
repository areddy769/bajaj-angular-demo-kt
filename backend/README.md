# Bajaj Angular Fresher Demo API

Standalone REST API for the **Angular 16 fresher training application**.

- **Stack:** Node.js 18 + Express + TypeScript + Prisma + SQLite + JWT + Zod
- **Runs fully locally** — no Docker, no cloud DB, no microservices.
- **Purpose:** give freshers a REAL backend to practise authentication, guards, interceptors, services, RxJS, reactive forms, CRUD, search/filter/sort/pagination, error handling and API integration.

> **Freshers: you do NOT need to work on this backend.**
> It is pre-built and ready to run. Your learning happens in the **Angular app**:
> just start this API (`npm run dev`), point your Angular code at
> `http://localhost:3000/api`, and build real login + CRUD features against it.
> The architecture/endpoint details below are here so you can *understand what
> you are calling* (great for interviews and debugging) — not because you need
> to change any backend code.

```
Angular 16 (http://localhost:4200)
        |  HTTP / REST  (Authorization: Bearer <JWT>)
        v
Node.js 18 + Express (http://localhost:3000)
        |
        v
Prisma ORM  →  SQLite (local file)
```

---

## 1. Project Overview

This API supports the Angular fresher demo:

| Feature | Endpoint |
|---|---|
| Health check | `GET /api/health` |
| Login (JWT) | `POST /api/auth/login` |
| Customers CRUD + search/filter/sort/pagination | `/api/customers` |
| User management (ADMIN only) | `/api/users` |
| Dashboard counts | `GET /api/dashboard/summary` |

Consistent response shape:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "...", "statusCode": 400 }
```

DELETE customer returns `200` with `{ success: true, message: "Customer deleted", data: null }`
(a deliberate choice so the Angular demo always receives the same JSON shape instead of an empty `204` body).

## 2. Architecture

Layered, beginner-readable (read this to understand what your Angular HTTP calls hit — no changes needed here):

```
Routes  →  Controllers  →  Services  →  Prisma  →  SQLite
                ↑ Middleware (authenticate, authorizeRoles, error, 404)
                ↑ Validators (Zod)
```

| Folder | Purpose |
|---|---|
| `controllers/` | Receive HTTP requests, return responses (no SQL here) |
| `services/` | Business + data logic (Prisma queries live here) |
| `routes/` | API endpoint definitions + which middleware applies |
| `middleware/` | `authenticate`, `authorizeRoles('ADMIN')`, central error handler, 404 |
| `validators/` | Zod schemas for request validation |
| `utils/` | JWT helpers, bcrypt helpers, `ok()` / `AppError` response helpers |
| `config/` | `env.ts` (reads `.env`), `prisma.ts` (single PrismaClient) |
| `types/` | `req.user` TypeScript typing |
| `prisma/` | `schema.prisma`, migrations, `seed.ts` |
| `tests/` | Jest + Supertest API tests |
| `postman/` | Ready-to-import collection |

## 3. Technology Stack

| Tool | Version | Why |
|---|---|---|
| Node.js | 18.x (see `.nvmrc`: `18.20.8`) | Matches Angular 16 training machines |
| Express | 4.19.2 | Simple, stable, Node 18 compatible |
| TypeScript | 5.4.5 | Strict but readable |
| Prisma | 5.22.0 | Typed SQLite access + migrations + Studio |
| SQLite | (via Prisma) | Zero-setup local file DB |
| jsonwebtoken | 9.0.2 | JWT auth |
| bcryptjs | 2.4.3 | Pure-JS bcrypt (same hashes as `bcrypt`, no native compiler needed on Windows) |
| dotenv | 16.4.5 | `.env` config |
| cors | 2.8.5 | Restricted to `FRONTEND_URL` |
| zod | 3.23.8 | Request validation |
| Jest 29 + ts-jest + Supertest 6 | — | Backend tests, all Node 18 compatible |

> `package.json` pins `engines: { "node": ">=18.10.0 <19" }`. No dependency requires Node 20+.

## 4. Prerequisites

- **Node.js 18.x** — check with `node --version` (expect `v18.x`)
- **npm** bundled with Node 18 — `npm --version`
- Optional: `nvm` (Windows: `nvm use 18.20.8`)
- Git

## 5. Repository Setup

The backend lives in the `backend/` folder of the main repo, on the `main` branch:

```bash
git clone <repository-url>
cd bajaj-angular-demo-kt/backend
```

All commands below run from inside `backend/`.

## 6. Installation

```bash
npm install
```

This also runs `prisma generate` (postinstall) to build the typed Prisma client.

## 7. Environment Configuration

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Git Bash / Linux / macOS:

```bash
cp .env.example .env
```

`.env` values:

```ini
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-this-development-secret
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:4200
```

Never commit `.env` (already in `.gitignore`). Never hard-code the JWT secret.

## 8. Database Setup

```bash
npx prisma migrate dev
```

This creates `prisma/dev.db` (SQLite file) + applies migrations. Nothing to install manually.

Useful:

```bash
npm run db:migrate   # same as above
npm run db:reset     # DELETES local data, re-applies migrations (asks to confirm)
npx prisma generate  # rebuild client if you see Prisma client errors
```

## 9. Running the Backend

```bash
npm run dev      # dev server with auto-reload (nodemon + ts-node)
npm run build    # TypeScript production build → dist/
npm start        # run compiled app (run build first)
```

## 10. Running Prisma Studio

```bash
npm run db:studio
# or: npx prisma studio
```

Opens a browser UI to inspect/edit the `User` and `Customer` tables.
Great for freshers: create a customer via the Angular app, then watch it appear in Studio; or tweak a row and re-fetch it through the API.

## 11. Seed Data

```bash
npm run seed
```

Idempotent — re-running never duplicates `admin@example.com` / `user@example.com` (uses `upsert`) and skips customers whose email already exists. Creates:

- Admin + User accounts (below)
- 18 realistic-but-fake Indian demo customers across Mumbai, Pune, Delhi, Hyderabad, etc.

## 12. Demo Login Credentials

| Role | Email | Password | Can do |
|---|---|---|---|
| ADMIN | `admin@example.com` | `Admin@123` | Everything, incl. user management + delete customers |
| USER | `user@example.com` | `User@123` | Customers list/create/update, dashboard. **Cannot** touch `/api/users` or delete customers |

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin@123\"}"
```

Returns `{ success, message, data: { token, user } }` — `passwordHash` is never included.

## 13. API Documentation

Base URL: `http://localhost:3000/api`

### `GET /api/health`

```json
{ "success": true, "message": "API is running", "data": null, "timestamp": "..." }
```

### `POST /api/auth/login`

Body: `{ "email": "...", "password": "..." }` → `200` + token, `401` bad credentials, `403` inactive user.

### Customers (all need `Authorization: Bearer <token>`)

```
GET    /api/customers?page=1&limit=10&search=rahul&status=ACTIVE&city=Mumbai&customerType=INDIVIDUAL&sortBy=firstName&sortOrder=asc
GET    /api/customers/:id
POST   /api/customers            (ADMIN, USER)
PUT    /api/customers/:id        (ADMIN, USER)
DELETE /api/customers/:id        (ADMIN only → USER gets 403)
```

List response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": { "page": 1, "limit": 10, "totalItems": 25, "totalPages": 3 }
  }
}
```

- Search covers `firstName, lastName, email, mobile`.
- Filters: `status, city, customerType`.
- Sort whitelist: `firstName, lastName, createdAt, status` (anything else falls back to `createdAt`).
- `page >= 1`, `limit` max `100`.

Customer validation: required names/email/mobile, Indian mobile (`/^(?:\+91|0)?[6-9]\d{9}$/`), 6-digit pincode, `MALE|FEMALE|OTHER`, `INDIVIDUAL|BUSINESS`, `ACTIVE|INACTIVE`. Failures → `400 { success:false, message:"Validation failed", errors:[{field,message}] }`.

### Users (all need ADMIN: `authenticate` + `authorizeRoles('ADMIN')`, never returns `passwordHash`)

```
GET   /api/users?page&limit&search&role&status
GET   /api/users/:id
POST  /api/users                 { name, email, password, role, status } → 201 (409 duplicate email)
PUT   /api/users/:id             { name?, email?, password?, role?, status? } (password only re-hashed when supplied)
PATCH /api/users/:id/status      { status: "ACTIVE" | "INACTIVE" }
```

### `GET /api/dashboard/summary` (ADMIN, USER)

```json
{ "success": true, "data": { "totalCustomers": 20, "activeCustomers": 15, "inactiveCustomers": 5, "totalUsers": 4 } }
```

Counts are always computed from the live DB.

### Status codes

`200` GET/PUT/PATCH · `201` POST · `200+message` DELETE · `400` validation · `401` unauthenticated · `403` unauthorised · `404` not found · `409` duplicate email · `500` unexpected.

## 14. Authentication Flow

1. Angular login form → `POST /api/auth/login`.
2. Backend verifies bcrypt hash, checks `status === ACTIVE`, signs JWT `{ userId, email, role }` with `JWT_SECRET`/`JWT_EXPIRES_IN`.
3. Angular stores the token, and an **HTTP interceptor** attaches `Authorization: Bearer <token>` to every later call.
4. `authenticate` middleware verifies the token on each protected route and sets `req.user`; missing/malformed/expired → `401`.

## 15. Authorization / Roles

- `authorizeRoles('ADMIN')` / `authorizeRoles('ADMIN','USER')` runs **after** `authenticate`.
- Angular route guards only improve UX/navigation — the backend middleware is the real enforcement:
  - `DELETE /api/customers/:id` → ADMIN only.
  - All `/api/users/*` → ADMIN only.
- USER attempting admin APIs gets `403 Forbidden`.

## 16. Error Handling

Central `error.middleware` translates:

- Zod errors → `400` + `errors[]`
- `AppError(message, statusCode)` thrown from services → matching status
- Prisma `P2002` → `409`, `P2025` → `404`
- Everything else → `500` without leaking stack traces (full error logged in development only)

Unknown routes → `404 { success:false, message:"Route not found" }`.

## 17. Testing

```bash
npm test          # run once
npm run test:watch
```

Covers: valid/invalid/unknown/inactive login, missing + invalid tokens, ADMIN vs USER access, customer list/pagination/search/filter/sort/get/create/validation/update/delete-as-ADMIN + delete-as-USER→403 + 404s, user list/create/duplicate/update/status, dashboard live counts, health, unknown-route 404. Tests auto-ensure the demo accounts exist, so they pass right after `migrate` even before `seed`.

## 18. Postman Collection

File: `postman/bajaj-angular-demo-api.postman_collection.json`

1. Import into Postman → **Import → File**.
2. Collection variable `baseUrl` defaults to `http://localhost:3000/api`.
3. Run **Login Admin** (or **Login User**) first — a test script saves the JWT into `{{token}}`, which the remaining requests reuse as Bearer auth.
4. Update `customerId` / `userId` variables with real ids from list responses.

## 19. Project Structure

(See §2 table — controllers/services/routes/middleware/validators/utils/config/types/prisma/tests/postman.)

## 20. Common Problems / Troubleshooting

| Symptom | Fix |
|---|---|
| Port 3000 in use (`EADDRINUSE`) | Change `PORT` in `.env`, or stop the other process |
| `Missing required environment variable: JWT_SECRET` | You forgot `Copy-Item .env.example .env` |
| Prisma client errors (`@prisma/client did not initialize`) | `npx prisma generate`, then restart |
| Migration drift / corrupt `dev.db` | `npm run db:reset` (**deletes local data**), then `npm run seed` |
| Angular gets CORS errors | Backend allows only `FRONTEND_URL` — keep Angular on `http://localhost:4200` or update `.env` and restart |
| `Invalid or expired token` (401) | Login again — `JWT_EXPIRES_IN` defaults to `1h` |
| Tests fail right after clone | Run `npx prisma migrate dev` first (tests need the DB file) |
| Want a clean demo | `npm run db:reset` (**deletes data**) + `npm run seed` |

## 21. Angular Frontend Integration

- Angular dev server: `http://localhost:4200` · API: `http://localhost:3000/api` · CORS origin comes from `FRONTEND_URL`.
- Request flow:

```
Angular Component → Angular Service → HttpClient → HTTP Interceptor
  → Authorization: Bearer <JWT> → Express → authenticate → authorizeRoles
  → Controller → Service → Prisma → SQLite
```

- Teach: **guards protect navigation, backend middleware protects data.** Remove the guard and the API still returns `401/403`.
- Suggested Angular mapping: login service, auth interceptor, `AuthGuard`/`AdminGuard`, customer service with `HttpParams` (page/limit/search/…), reactive-form validation mirroring the backend, list component with paginator/sort/filter, global HTTP error handler reading `{ success, message, errors }`.

## 22. Git Workflow for Freshers

Your Angular work follows the normal flow:

```bash
git clone <url> && cd bajaj-angular-demo-kt
git checkout -b feat/<short-name>   # never commit straight to main
# …build your Angular feature, small commits…
git add -p && git commit -m "feat: add customer list page"
git push -u origin feat/<short-name>
# open a Pull Request, get one review, merge, delete branch
```

You are **not expected to modify `backend/`**. If you ever peek inside out of
curiosity and change something, keep it on your feature branch and mention it
in the PR — never commit `.env` or `*.db` files.
