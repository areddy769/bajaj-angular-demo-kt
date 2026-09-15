# BRD-01 — Angular 16 Customer Portal Application — v1.0 (FROZEN)

> **Status: frozen baseline.** Do not add libraries, architecture patterns, features,
> or infrastructure on your own. If you believe something is required, raise it
> during review first. See §23 for what is explicitly out of scope.

## 1. Project Overview

### Project Name

**Customer Portal — Angular 16 Application**

### Objective

Build a small but production-style Angular 16 application demonstrating the core concepts expected of an enterprise Angular developer:

* Authentication
* Authorization / role-based access
* Lazy-loaded feature modules
* Route guards
* HTTP communication
* HTTP interceptor
* Reactive Forms
* CRUD operations
* Reusable components
* Services and dependency injection
* RxJS
* Error handling
* Loading states
* Search / filter / sort
* Pagination
* Form validation
* Role-based UI
* Unit testing
* Git branching and PR workflow
* Proper project structure
* README / documentation

The application communicates with a **locally running Node.js backend and local database**, already provided in the `backend/` directory of this repository. That backend must be run as-is — it must **not** be reimplemented, modified, or moved into the Angular codebase.

## 2. Runtime / Framework Versions (locked)

```text
- Angular: 16.x
- Angular CLI: 16.x
- Node.js: 18.x (recommended: 18.20.x)
- npm: version bundled with Node.js 18
- RxJS: Angular 16-compatible 7.x
- Testing: Jasmine / Karma
```

The project must not be upgraded to Angular 17+ or Node.js 20+ as part of this BRD.

## 3. Business Scenario

Build an internal **Customer & User Management Portal** where authenticated employees manage customer records.

Two roles exist:

### ADMIN — can:

* View, create, edit, and delete customers
* View customer details
* Search / filter / sort customers
* Manage users (list, add, edit, activate/deactivate)
* View dashboard information

### USER — can:

* View customers
* Search / filter / sort customers
* View customer details
* Create and edit customers

### USER — cannot:

* Delete customers
* Manage users
* Access admin-only screens

The ADMIN/USER split exists so that **authorization is genuinely required**, not a guard that always returns `true`.

## 4. Application Modules

```text
Angular Application
│
├── Authentication
│   ├── Login
│   └── Logout
│
├── Dashboard
│
├── Customer Management
│   ├── Customer List
│   ├── Customer Details
│   ├── Add Customer
│   └── Edit Customer
│
├── User Management
│   ├── User List
│   ├── Add User
│   └── Edit User
│
└── Unauthorized / Error
```

## 5. Provided Backend (read this first)

The API is already implemented, tested, and documented in `backend/`. Full reference: `backend/README.md`. Summary contract:

* Base URL: `http://localhost:3000/api` (Angular dev server runs on `http://localhost:4200`)
* Response envelope — success: `{ "success": true, "message", "data" }`; error: `{ "success": false, "message", "statusCode", "errors?" }`
* Auth: `POST /api/auth/login` with `{ email, password }` → `{ token, user }`. Never hard-code credential checks in Angular.
* Customers (all require `Authorization: Bearer <token>`):
  `GET /api/customers?page&limit&search&status&city&customerType&sortBy&sortOrder` (paged: `{ items, pagination }`),
  `GET /api/customers/:id`, `POST /api/customers`, `PUT /api/customers/:id`,
  `DELETE /api/customers/:id` (**ADMIN only**, others get `403`)
* Users (**ADMIN only**): `GET /api/users`, `GET /api/users/:id`, `POST /api/users`,
  `PUT /api/users/:id`, `PATCH /api/users/:id/status`
* Dashboard: `GET /api/dashboard/summary` → `{ totalCustomers, activeCustomers, inactiveCustomers, totalUsers }`
* Health: `GET /api/health`
* Demo accounts: `admin@example.com` / `Admin@123` (ADMIN), `user@example.com` / `User@123` (USER)

Start it before any Angular work:

```bash
cd backend
cp .env.example .env     # PowerShell: Copy-Item .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

## 6. Authentication

Implement a proper login flow.

### Login screen — fields: email, password. Requirements:

* Reactive Form with required + email + minimum-length password validation
* API call to `POST /api/auth/login` (no hard-coded credential logic such as `if (username === 'admin')`)
* Loading indicator during the request
* Distinct handling for invalid credentials (`401`), inactive account (`403`), and unreachable API (network error)
* On success: persist session, navigate to the originally requested page or `/dashboard`
* Logout functionality that clears the session

Maintain authenticated-user state in an observable-based store (e.g. `BehaviorSubject`) so the whole UI reacts to login/logout, and so the session survives a browser refresh.

## 7. Route Guards

Implement at least two guards.

### Authentication guard

```text
/login         → public
/dashboard     → authenticated
/customers     → authenticated
/users         → authenticated + ADMIN
```

Unauthenticated visits to protected routes redirect to `/login`, preserving the requested URL for post-login return.

### Role (authorization) guard

`/users` is ADMIN-only. A USER navigating there manually is redirected to `/unauthorized`.

The implementation must reflect the difference between **authentication** ("who are you?") and **authorization** ("are you allowed?"). Guards protect navigation; the backend remains the authority on data access.

## 8. HTTP Interceptor

### Request

Automatically attach `Authorization: Bearer <token>` to authenticated API calls. Individual services must not add the token manually.

### Response / error — application-wide policy, at minimum:

```text
401 → session invalid/expired → logout + redirect to login
403 → not permitted → unauthorized page/message
404 → resource not found → user-friendly message
500 → server error → generic "something went wrong" message
```

## 9. Lazy Loading

```text
AppModule
│
├── AuthModule
├── DashboardModule
├── CustomerModule
└── UserModule
```

`/customers` and `/users` (and preferably all feature areas) must load their modules lazily — verifiable as separate chunks in the Network tab.

## 10. Customer CRUD (primary feature)

Customer fields: `id, firstName, lastName, email, mobile, dateOfBirth, gender, city, state, pincode, customerType, status, createdAt, updatedAt`.

### Customer list — columns: ID, name, email, mobile, city, status, actions (View / Edit / Delete).

* **Search** (server-side `search`): name, email, mobile
* **Filters**: status, customer type, city
* **Sorting**: name, created date, status (`sortBy`/`sortOrder`)
* **Pagination**: real API-driven pagination via `page`/`limit` (see §5)

### Add customer — Reactive Form with: required, email, mobile-format, min/max length, pincode-format, and date validation.

### Edit customer — the same form component in edit mode:

```text
List → Edit → GET customer → populate form → modify → PUT → success → List
```

Do not duplicate the add component for editing.

### Delete customer — confirmation dialog first, then `DELETE /api/customers/:id`; handle success, failure, loading, and API errors; refresh the list afterwards.

### Customer details (`/customers/:id`) — name, email, mobile, DOB, gender, address, type, status, created/updated dates; covers route params, GET by ID, lifecycle, and loading/error states.

## 11. User Management (ADMIN only)

User list, add user, edit user, activate/deactivate user.

User fields displayed/managed by the UI:

* `id`
* `name`
* `email`
* `role` (`ADMIN` / `USER`)
* `status`

Password rules:

* Required when creating a user
* Optional when editing a user (blank keeps the current password)
* Never displayed in the user list/details
* Never returned by the API
* Never stored in Angular local/session storage

## 12. Dashboard

Cards for total / active / inactive customers and total users, populated from `GET /api/dashboard/summary` — never hard-coded.

## 13. Services

```text
AuthService, CustomerService, UserService, DashboardService,
NotificationService, LoadingService
```

Components must not contain HTTP logic:

```text
Component → Service → HttpClient → Interceptor → Backend API
```

## 14. RxJS (must be genuinely used, not subscribe-everywhere)

Observable, Subject, BehaviorSubject, `map`, `filter`, `switchMap`, `catchError`, `tap`, `finalize`, and disciplined subscription management (`async` pipe preferred; manual subscriptions unsubscribed).

## 15. Reusable Components

Build shared components where reuse pays off (not everything): button, input, modal/confirmation dialog, loader, empty state, error message, pagination, status badge. Be ready to justify what was — and wasn't — generalized.

## 16. Structure

```text
src/app/
├── core/          # guards, interceptors, services, models
├── shared/        # components, directives, pipes, shared.module.ts
├── features/      # auth, dashboard, customers, users (lazy)
├── layout/        # header, sidebar, footer
└── app-routing.module.ts
```

## 17. Error / Loading Handling

Every API-driven screen accounts for loading, success, empty, and error states — no blank screens while loading or failing.

## 18. Testing (Angular 16 setup — Karma/Jasmine)

* Components: rendering, inputs/outputs, actions, form validation, conditional UI
* Services: HTTP calls, success and error responses
* Guards: authenticated→allow, unauthenticated→redirect, ADMIN→allow, USER→deny
* Interceptor: token attached, login request skipped, logged-out passthrough

## 19. Git Workflow

One branch per developer, never commit to `main` directly:

```bash
git checkout main && git pull
git checkout -b feature/<name>-<topic>
# small, focused commits
git push -u origin feature/<name>-<topic>   # then open a PR
```

## 20. Code Review Readiness

Every developer must be able to explain their own code — not copy-paste-run. Expect questions such as: why the service layer exists; why a module is lazy-loaded; why the interceptor owns the token; where the token is stored and what happens on expiry/refresh; guard vs backend authorization; behavior on 401/403/404/500; why `switchMap` was chosen; how `shared` vs `core` vs `features` was decided; what happens when DELETE fails.

## 21. Implementation Sequence (follow in order)

### Phase 1 — Project Setup

* Angular 16 project setup (versions locked per §2)
* Git repository setup, `main` branch discipline, feature-branch workflow
* Base application structure (§16)

### Phase 2 — Application Shell

* Header, sidebar/navigation, footer, routing, feature-module structure, lazy loading

### Phase 3 — Authentication

* Login page, Reactive Form, AuthService, login API integration,
  session persistence, logout, `BehaviorSubject` auth state

### Phase 4 — Authorization

* Auth guard, role guard, ADMIN/USER handling, unauthorized page, role-based navigation/UI

### Phase 5 — HTTP Infrastructure

* API configuration, HTTP interceptor, authorization header,
  401 / 403 / 404 / 500 handling

### Phase 6 — Customer Management

* Customer list, API integration, search, filter, sort, pagination, customer details

### Phase 7 — Customer CRUD

* Add customer, edit customer, shared add/edit form, validation,
  delete confirmation, delete authorization behavior

### Phase 8 — User Management

* ADMIN-only user module: list, add, edit, activate/deactivate

### Phase 9 — Dashboard & UX

* Dashboard API integration, loading/empty/error states, notifications, reusable components

### Phase 10 — Testing & Refactoring

* Component, service, guard, and interceptor tests; refactoring; code review; README/documentation

### Phase 11 — Advanced Concepts (only after the core app is stable)

* Module Federation, Stencil integration, integration of a remote feature/component

## 22. Implementation Quality Rules

The application must not be implemented as a single-component demo. Avoid:

* Hard-coded API responses
* Hard-coded authentication/authorization decisions
* HTTP calls directly from components
* Duplicate Add/Edit forms
* Duplicate business logic
* Excessive use of `any`
* Unnecessary global variables
* `subscribe()` everywhere when `async` pipe or observable composition is appropriate
* Disabling TypeScript/Angular compiler checks to make code compile
* Copy-pasting the same implementation across features

Developers must be able to explain every significant implementation decision during review.

## 23. Scope Boundaries (intentionally out of scope)

```text
NgRx, SSR, Docker, Kubernetes, cloud deployment, OAuth/social login,
refresh-token infrastructure, WebSockets, GraphQL, microservices, Redis,
Kafka, MySQL/PostgreSQL, CI/CD pipelines
```

These may be discussed separately but must not enter the implementation unless explicitly instructed by the mentor.

## 24. Definition of Done

Login/logout works against the real API for both roles; guards and role UI behave per §7; token attaches automatically; lazy chunks verified; full customer CRUD with server search/filter/sort/pagination; ADMIN-only user management; live dashboard; every screen has loading/empty/error states; tests pass (`npm test`); README documents setup and API usage; PR opened from a feature branch with a clean diff.
