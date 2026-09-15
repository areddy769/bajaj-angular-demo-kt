# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: fresher trainees learning Angular 16 on a reference application. They read
the UI and its code to learn auth, guards, interceptors, forms, CRUD, and RxJS.
Secondary: anyone demoing the app as an employee operating a customer portal
(ADMIN manages everything, USER handles customers without delete or user admin).

## Product Purpose

A small but production-style Customer & User Management Portal that gives trainees
a REAL backend-driven app to build against and learn from. Success means a trainee
can log in, perform customer CRUD with search/filter/sort/pagination, explain every
layer involved, and pass a code review on their own feature branch.

## Positioning

Unlike a mocked demo, every screen hits a real local REST API with JWT auth and
role enforcement, so guards, interceptors, and error states teach real behavior.

## Operating Context

Runs locally: Angular dev server on :4200, Node 18 + Express + Prisma + SQLite API
on :3000. Used in training rooms and on trainee laptops, desktop-first, in daylight
office conditions. Demo accounts: admin@example.com (ADMIN), user@example.com (USER).

## Capabilities and Constraints

Capabilities: JWT login/logout, dashboard counts, customer CRUD + server-side
search/filter/sort/pagination, ADMIN-only user management + activate/deactivate.
Constraints: NOTHING functional may change in a UI revamp — routes, component APIs,
service contracts, validation rules, and test expectations stay as-is. Angular 16,
no UI library (hand-rolled CSS so every rule stays readable), Node 18 compat.

## Brand Commitments

Neutral training identity: no company name, logo, or official branding anywhere
in the UI (this is not an official app). Deep-blue enterprise tone is a visual
choice, not a brand claim. No invented testimonials, customers, or claims.

## Evidence on Hand

Real backend with seed data (18 demo customers) in `backend/`; Postman collection
in `backend/postman/`; live API at http://localhost:3000/api when running.

## Product Principles

1. The tool disappears into the task — earned familiarity over decoration.
2. Every screen teaches: loading, empty, and error states are first-class.
3. Guards protect navigation; the API protects data — the UI must show both honestly.
4. Consistency over surprise: one vocabulary for buttons, forms, tables, states.
5. Training-legible: code and copy stay explainable to a fresher in review.

## Accessibility & Inclusion

Keyboard-focusable controls with visible focus, contrast-safe text, no
color-only status signalling (badges carry text labels).
