# Bajaj Angular Fresher Demo Application

Reference Angular 16 application for fresher training: authentication, authorization,
lazy-loaded modules, guards, interceptors, reactive forms, CRUD, RxJS, testing —
all wired to a **real local backend** (`backend/`, Node 18 + Express + SQLite).

> **Freshers: this frontend is where you learn.** The backend is pre-built and
> ready to run — you start it, then build and explore Angular features against it.

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

## 1. What This App Demonstrates (BRD concept map)

| Concept | Where to look |
|---|---|
| Authentication (backend-verified login) | `src/app/features/auth/`, `core/services/auth.service.ts` |
| Authorization / role UI + role guard | `core/guards/admin.guard.ts`, sidebar `*ngIf="auth.hasRole('ADMIN')"` |
| Auth guard + returnUrl | `core/guards/auth.guard.ts` |
| HTTP interceptor (token) | `core/interceptors/auth.interceptor.ts` |
| HTTP interceptor (global spinner) | `core/interceptors/loading.interceptor.ts` |
| HTTP interceptor (401/403/404/500 policy) | `core/interceptors/error.interceptor.ts` |
| Lazy-loaded modules | `app-routing.module.ts` → Auth, Dashboard, Customers, Users |
| Reactive forms + validation | `customer-form/`, `user-form/`, `login/` + `shared/validators/` |
| CRUD + server pagination/search/filter/sort | `features/customers/customer-list/` + `customer.service.ts` |
| Route params + detail page | `customer-detail/` (`/customers/:id`) |
| Reusable components | `shared/components/` (loader, toasts, confirm, badge, pagination, empty/error) |
| Services + DI | `core/services/` (components never touch `HttpClient` directly) |
| RxJS (`BehaviorSubject`, `debounceTime`, `switchMap`, `catchError`, `finalize`, `async` pipe) | guards, list search, detail, dashboard state |
| Loading / empty / error states | every API-driven screen |
| Unit tests (components, services, guards, interceptor, pipe) | `*.spec.ts` next to the code under test |

---

## 2. Prerequisites

- **Node.js 18.x** (`node --version` → `v18.x`; repo `.nvmrc` files pin `18.20.8`)
- npm bundled with Node 18, Git, Google Chrome (for `ng test`)
- The backend from this same repo (see §4) — the app cannot log in without it

## 3. Setup (frontend)

```bash
git clone <repository-url>
cd bajaj-angular-demo-kt
npm install
npm start            # ng serve → http://localhost:4200
```

## 4. Backend (must be running)

In a second terminal, from the repo root:

```bash
cd backend
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
npx prisma migrate dev
npm run seed
npm run dev              # API at http://localhost:3000/api
```

Full backend docs: [backend/README.md](backend/README.md).

### Demo logins

| Role | Email | Password | Allowed |
|---|---|---|---|
| ADMIN | `admin@example.com` | `Admin@123` | Everything, incl. Users screens + customer delete |
| USER | `user@example.com` | `User@123` | Dashboard, customers (no delete, no Users screens) |

## 5. How to Walk Through the App (15-minute tour)

1. Open `http://localhost:4200` → redirected to `/login` by `AuthGuard` (note `?returnUrl=`).
2. Log in as USER. Land on **Dashboard** (live counts from `GET /dashboard/summary`).
3. Open **Customers**: type in search (debounced API call), filter by status/city, sort Name/Status/Created, page through results.
4. **Add Customer** with a bad mobile/pincode → inline validation; submit mirrors backend rules.
5. Open a customer → detail page via route param; **Edit** reuses the same form component.
6. Try **Delete** as USER → button hidden; call the API directly and you get `403` (backend enforces it).
7. Try `/users` as USER → `AdminGuard` sends you to `/unauthorized`.
8. Log out, log in as ADMIN → **Users** appears: list, add, edit, activate/deactivate.
9. Open DevTools Network tab → see `features-customers-*.js` lazy chunks + `Authorization: Bearer` headers the interceptor adds.

## 6. Project Structure

```
src/app/
├── core/                 # singleton app-wide logic (imported once via CoreModule)
│   ├── guards/           # auth.guard (who are you?) / admin.guard (are you allowed?)
│   ├── interceptors/     # auth (token) / loading (spinner) / error (401·403·404·500)
│   ├── services/         # auth (BehaviorSubject session) / customer / user /
│   │                     #   dashboard / notification / loading / confirm-dialog
│   └── models/           # User, Customer, Dashboard, ApiResponse shapes
├── shared/               # reusable UI: loader, toasts, confirm, badge,
│                         #   pagination, empty/error states, fullName pipe,
│                         #   indianMobile + pincode validators
├── features/             # LAZY modules: auth / dashboard / customers / users
├── layout/               # header / sidebar (role-based links) / footer
├── app-routing.module.ts # lazy routes + guard wiring
└── app.component.*       # shell: header/sidebar only when logged in
```

Rules of thumb for freshers: put it in `shared/` if two screens use it; put HTTP in a
`core/services/*` service, never in a component; a guard answers one question
(auth **or** role, not both).

## 7. Auth Flow (what to explain in reviews)

1. Login form → `AuthService.login()` → `POST /api/auth/login` (backend checks bcrypt hash).
2. Token + user saved to `localStorage`; `currentUserSubject` (BehaviorSubject) emits → whole UI updates via `async` pipe.
3. `AuthInterceptor` attaches the token to every later API call (except login).
4. Refresh → service restores the session from `localStorage`.
5. `401` → `ErrorInterceptor` logs out + back to login; `403` → `/unauthorized`.
6. Guards protect **navigation**; backend middleware protects **data** (try calling the API without a token — `401`).

## 8. Testing

```bash
npm test          # ng test, headless Chrome, single run
```

Covers: login form validation, `AuthService` login/logout + query-param mapping in
`CustomerService`, `AuthGuard`/`AdminGuard` allow/redirect matrix, `AuthInterceptor`
token attach/skip, `PaginationComponent`, `FullNamePipe`, app shell. Backend suite:
`cd backend && npm test` (25 Jest tests). Chrome is required for `ng test`; on machines
without it, `npm run build` still validates compilation.

## 9. Backend Integration Reference

- Base URL: `http://localhost:3000/api` (`src/environments/environment.ts`)
- Response shape: `{ success, message, data }`; paged lists: `{ items, pagination }`
- Customers support `page, limit, search, status, city, customerType, sortBy, sortOrder`
- `DELETE /customers/:id` and all `/users/*` are ADMIN-only (expect `403` as USER)
- Postman collection: `backend/postman/*.postman_collection.json`

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| Login says "Cannot reach the API" | Start the backend (§4); check `http://localhost:3000/api/health` |
| CORS error in console | Keep Angular on `:4200` (backend allows `FRONTEND_URL` from `backend/.env`) |
| Redirected to login on every refresh | `localStorage` cleared or token expired (`JWT_EXPIRES_IN=1h`) — log in again |
| `/users` shows Unauthorized as ADMIN | You logged in as USER — check the role badge in the header |
| `ng test` won't start | Install Chrome; CI uses `ChromeHeadless` |
| Port 4200 busy | `ng serve --port 4300` (backend CORS still allows only `:4200` API calls from the app origin — the app will still call `:3000` fine) |

## 11. Git Workflow for Freshers

```bash
git checkout main && git pull
git checkout -b feature/<your-name>-<topic>   # never commit to main
# …small, focused commits…
git push -u origin feature/<your-name>-<topic>  # then open a PR
```

You must be able to explain your own code (see backend README §22-style review
questions: why the service layer, why lazy loading, where the token lives, what a
`401` does, why `switchMap`, auth vs authorization…).
