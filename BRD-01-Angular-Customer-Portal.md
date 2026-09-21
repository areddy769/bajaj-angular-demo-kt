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
