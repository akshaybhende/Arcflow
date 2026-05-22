# Arcflow

A production-grade Enterprise CRM built with **Angular 21**, **NgRx**, and **Angular Material**.

**Live demo:** https://arcflow.vercel.app *(placeholder)*

![Arcflow Dashboard](./docs/screenshot.png)

## Features

- Contacts management (CRUD, search, filter, table & card views)
- Deals pipeline (Kanban drag-and-drop + list view)
- Companies management
- Activity feed & logging
- Dashboard with Chart.js analytics
- Dark / light mode with system preference
- NgRx state management
- Lazy-loaded feature modules
- Fully responsive (mobile + tablet)

## Tech stack

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-21-8B5CF6)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Material-21-757575?logo=angular&logoColor=white)

## Getting started

```bash
npm install
npm start
```

Open http://localhost:4200 and sign in with:

- **Email:** `demo@arcflow.io`
- **Password:** `demo123`

### Production build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Architecture

```
src/app/
├── core/          # Auth, HTTP services, guards, interceptors, models
├── shared/        # Reusable UI components, pipes, directives
├── layout/        # Main shell (sidebar, topbar)
├── store/         # NgRx slices (contacts, deals, companies, activities, ui)
├── features/      # Lazy-loaded modules (dashboard, contacts, deals, …)
└── mock/          # In-memory API + seed data
```

**State:** Each entity uses `@ngrx/entity` with effects calling `HttpClient` against the in-memory web API (`/api/*`). UI state covers theme, sidebar collapse, and global loading.

**Routing:** Authenticated routes sit under `MainLayout` with `AuthGuard`. Feature modules load on demand.

See [arcflow-prd.md](./arcflow-prd.md) for the full product specification.

## License

MIT
