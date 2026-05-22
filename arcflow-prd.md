# Project Requirements Document
## Arcflow — Enterprise CRM Application (Angular)

> **Purpose:** This document is a complete specification for Claude Code to scaffold, build, and deliver a production-grade Angular CRM application called **Arcflow**. Follow every section in order. Use the latest stable version of Angular (v18+) and npm as the package manager. Do not skip sections. Ask for clarification only if a requirement is genuinely ambiguous.

---

## 1. Project Overview

### 1.1 What We Are Building

**Arcflow** is a fully functional, enterprise-grade Customer Relationship Management web application built with Angular. It demonstrates real-world Angular patterns including:

- Feature-based lazy-loaded module architecture
- NgRx for global state management
- Angular Material + custom design tokens for UI
- Role-based access control (frontend)
- Complex reactive forms with validation
- Data tables with sorting, filtering, pagination
- Kanban-style deals pipeline with drag-and-drop
- Activity feed and timeline
- Responsive layout with sidebar navigation
- Dark/light mode toggle

This is a **frontend-only** application. All data is mocked using an in-memory service that simulates API calls with realistic delays. No real backend is required.

### 1.2 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 18+ (latest) |
| Language | TypeScript | 5.x |
| UI Library | Angular Material | 18+ |
| State Management | NgRx (Store + Effects + Selectors) | 18+ |
| Forms | Angular Reactive Forms | built-in |
| Routing | Angular Router (lazy modules) | built-in |
| Styling | SCSS + CSS custom properties | — |
| Drag & Drop | Angular CDK DragDrop | built-in |
| Charts | ng2-charts (Chart.js wrapper) | latest |
| Icons | Angular Material Icons + custom SVGs | — |
| HTTP | Angular HttpClient + In-Memory Web API | latest |
| Package Manager | npm | — |
| Testing | Jasmine + Karma (unit) | built-in |
| Linting | ESLint + Angular ESLint | latest |

### 1.3 Project Initialization

Run this exact command to scaffold:
```bash
npm install -g @angular/cli@latest
ng new arcflow \
  --routing=true \
  --style=scss \
  --strict=true \
  --standalone=false \
  --package-manager=npm \
  --directory .
```

Then install dependencies:
```bash
# Angular Material
ng add @angular/material

# NgRx
npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools

# Angular In-Memory Web API (mock backend)
npm install angular-in-memory-web-api --save-dev

# Charts
npm install ng2-charts chart.js

# Utilities
npm install date-fns uuid
npm install --save-dev @types/uuid
```

When `ng add @angular/material` prompts:
- Theme: **Custom** (we define our own)
- Typography: **Yes**
- Animations: **Yes (Include and enable animations)**

---

## 2. Folder Structure

```
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   └── core.module.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── page-header/
│   │   │   │   ├── stat-card/
│   │   │   │   ├── empty-state/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   ├── avatar/
│   │   │   │   └── loading-spinner/
│   │   │   ├── directives/
│   │   │   │   └── click-outside.directive.ts
│   │   │   ├── pipes/
│   │   │   │   ├── initials.pipe.ts
│   │   │   │   ├── time-ago.pipe.ts
│   │   │   │   └── currency-format.pipe.ts
│   │   │   └── shared.module.ts
│   │   ├── layout/
│   │   │   ├── main-layout/
│   │   │   │   └── main-layout.component.ts
│   │   │   ├── sidebar/
│   │   │   │   └── sidebar.component.ts
│   │   │   ├── topbar/
│   │   │   │   └── topbar.component.ts
│   │   │   └── layout.module.ts
│   │   ├── store/
│   │   │   ├── app.state.ts
│   │   │   ├── contacts/
│   │   │   │   ├── contacts.actions.ts
│   │   │   │   ├── contacts.effects.ts
│   │   │   │   ├── contacts.reducer.ts
│   │   │   │   └── contacts.selectors.ts
│   │   │   ├── deals/
│   │   │   ├── activities/
│   │   │   └── ui/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── contacts/
│   │   │   ├── deals/
│   │   │   ├── activities/
│   │   │   ├── companies/
│   │   │   └── settings/
│   │   ├── mock/
│   │   │   ├── in-memory-data.service.ts
│   │   │   └── mock-data.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   │   └── images/
│   ├── styles/
│   │   ├── _tokens.scss
│   │   ├── _material-theme.scss
│   │   ├── _typography.scss
│   │   ├── _utilities.scss
│   │   └── styles.scss
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
```

---

## 3. Design System & Styling

### 3.1 Design Tokens (`src/styles/_tokens.scss`)

```scss
:root {
  // ─── Brand ───
  --color-brand-50:  #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-900: #1e3a8a;

  // ─── Semantic (Light) ───
  --color-bg:              #f8fafc;
  --color-bg-surface:      #ffffff;
  --color-bg-subtle:       #f1f5f9;
  --color-bg-muted:        #e2e8f0;

  --color-border:          #e2e8f0;
  --color-border-strong:   #cbd5e1;

  --color-text-primary:    #0f172a;
  --color-text-secondary:  #475569;
  --color-text-tertiary:   #94a3b8;
  --color-text-disabled:   #cbd5e1;
  --color-text-inverse:    #ffffff;
  --color-text-link:       #2563eb;

  --color-primary:         #2563eb;
  --color-primary-dark:    #1d4ed8;
  --color-primary-subtle:  #eff6ff;

  --color-success:         #16a34a;
  --color-success-subtle:  #f0fdf4;
  --color-warning:         #d97706;
  --color-warning-subtle:  #fffbeb;
  --color-danger:          #dc2626;
  --color-danger-subtle:   #fef2f2;
  --color-info:            #0284c7;
  --color-info-subtle:     #f0f9ff;

  // ─── Deal Stage Colors ───
  --color-stage-lead:       #8b5cf6;
  --color-stage-qualified:  #3b82f6;
  --color-stage-proposal:   #f59e0b;
  --color-stage-negotiation:#f97316;
  --color-stage-won:        #16a34a;
  --color-stage-lost:       #dc2626;

  // ─── Typography ───
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  // ─── Spacing ───
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  // ─── Radius ───
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-full: 9999px;

  // ─── Shadow ───
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);

  // ─── Sidebar ───
  --sidebar-width:          240px;
  --sidebar-collapsed-width: 64px;
  --topbar-height:           64px;

  // ─── Transitions ───
  --transition-fast:   100ms ease;
  --transition-normal: 200ms ease;
  --transition-slow:   300ms ease;
}

// ─── Dark Mode ───
[data-theme="dark"] {
  --color-bg:              #0f172a;
  --color-bg-surface:      #1e293b;
  --color-bg-subtle:       #334155;
  --color-bg-muted:        #475569;

  --color-border:          #334155;
  --color-border-strong:   #475569;

  --color-text-primary:    #f1f5f9;
  --color-text-secondary:  #94a3b8;
  --color-text-tertiary:   #64748b;
  --color-text-disabled:   #475569;
  --color-text-inverse:    #0f172a;
  --color-text-link:       #60a5fa;

  --color-primary-subtle:  #1e3a8a;
  --color-success-subtle:  #14532d;
  --color-warning-subtle:  #78350f;
  --color-danger-subtle:   #7f1d1d;
  --color-info-subtle:     #0c4a6e;
}
```

### 3.2 Angular Material Custom Theme (`src/styles/_material-theme.scss`)

```scss
@use '@angular/material' as mat;
@include mat.core();

$arcflow-primary: mat.define-palette(mat.$blue-palette, 600, 400, 800);
$arcflow-accent:  mat.define-palette(mat.$indigo-palette, 500);
$arcflow-warn:    mat.define-palette(mat.$red-palette, 600);

$arcflow-light-theme: mat.define-light-theme((
  color: (
    primary: $arcflow-primary,
    accent:  $arcflow-accent,
    warn:    $arcflow-warn,
  ),
  typography: mat.define-typography-config(
    $font-family: "'Inter', sans-serif",
  ),
  density: 0,
));

$arcflow-dark-theme: mat.define-dark-theme((
  color: (
    primary: $arcflow-primary,
    accent:  $arcflow-accent,
    warn:    $arcflow-warn,
  ),
));

// Default (light) theme
@include mat.all-component-themes($arcflow-light-theme);

// Dark theme scoped to attribute
.dark-theme {
  @include mat.all-component-colors($arcflow-dark-theme);
}
```

### 3.3 Global Styles (`src/styles/styles.scss`)

```scss
@use './tokens' as *;
@use './material-theme' as *;
@use './typography' as *;
@use './utilities' as *;

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

// Smooth theme transitions
* {
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal),
              color var(--transition-normal);
}

// Remove default Angular Material card styles we'll override
.mat-mdc-card {
  --mdc-elevated-card-container-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm) !important;
  border-radius: var(--radius-lg) !important;
}
```

---

## 4. Data Models & Types

Create `src/app/core/models/` with the following TypeScript interfaces:

### 4.1 `contact.model.ts`
```typescript
export type ContactStatus = 'active' | 'inactive' | 'prospect' | 'customer' | 'churned';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'cold-call' | 'event' | 'other';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  status: ContactStatus;
  leadSource: LeadSource;
  avatar?: string;           // URL or null (fallback to initials)
  tags: string[];
  notes?: string;
  address?: Address;
  socialLinks?: SocialLinks;
  dealIds: string[];
  activityIds: string[];
  createdAt: string;         // ISO date string
  updatedAt: string;
  lastContactedAt?: string;
  owner: string;             // User display name
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}
```

### 4.2 `deal.model.ts`
```typescript
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  companyName?: string;
  stage: DealStage;
  value: number;             // in USD
  currency: string;          // 'USD'
  priority: DealPriority;
  probability: number;       // 0-100 percentage
  expectedCloseDate: string; // ISO date string
  actualCloseDate?: string;
  owner: string;
  tags: string[];
  notes?: string;
  activityIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 4.3 `company.model.ts`
```typescript
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
export type CompanyIndustry =
  | 'technology' | 'finance' | 'healthcare' | 'retail'
  | 'manufacturing' | 'education' | 'consulting' | 'other';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  industry: CompanyIndustry;
  size: CompanySize;
  revenue?: number;
  phone?: string;
  email?: string;
  website?: string;
  address?: Address;
  contactIds: string[];
  dealIds: string[];
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.4 `activity.model.ts`
```typescript
export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'deal-update' | 'contact-created';
export type ActivityStatus = 'pending' | 'completed' | 'cancelled';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  companyId?: string;
  status: ActivityStatus;
  dueDate?: string;          // ISO date string
  completedAt?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.5 `user.model.ts`
```typescript
export type UserRole = 'admin' | 'manager' | 'sales-rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}
```

---

## 5. Mock Data & In-Memory API

### 5.1 Mock Data (`src/app/mock/mock-data.ts`)

Generate realistic mock data with the following counts:
- **30 Contacts** — varied statuses, industries, realistic names
- **20 Companies** — mix of tech, finance, healthcare industries
- **25 Deals** — spread across all 6 stages, various values ($1,000–$500,000)
- **50 Activities** — mix of calls, emails, meetings, tasks
- **3 Users** — one admin, one manager, one sales-rep

Use `uuid` for IDs. Use `date-fns` to generate realistic past/future dates.

Example structure (fill with realistic data, not "Lorem ipsum"):
```typescript
import { v4 as uuidv4 } from 'uuid';
import { subDays, addDays, formatISO } from 'date-fns';

export const MOCK_USERS: User[] = [
  {
    id: uuidv4(),
    name: 'Alex Johnson',
    email: 'alex@arcflow.io',
    role: 'admin',
    department: 'Sales',
  },
  // ... 2 more users
];

export const MOCK_COMPANIES: Company[] = [ /* 20 companies */ ];
export const MOCK_CONTACTS: Contact[] = [ /* 30 contacts */ ];
export const MOCK_DEALS: Deal[] = [ /* 25 deals */ ];
export const MOCK_ACTIVITIES: Activity[] = [ /* 50 activities */ ];
```

### 5.2 In-Memory Web API (`src/app/mock/in-memory-data.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return {
      contacts:   MOCK_CONTACTS,
      companies:  MOCK_COMPANIES,
      deals:      MOCK_DEALS,
      activities: MOCK_ACTIVITIES,
      users:      MOCK_USERS,
    };
  }
}
```

Register in `AppModule`:
```typescript
HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
  delay: 300,          // simulate network latency
  passThruUnknownUrl: true,
})
```

---

## 6. NgRx Store

### 6.1 App State (`src/app/store/app.state.ts`)

```typescript
export interface AppState {
  contacts:   ContactsState;
  deals:      DealsState;
  companies:  CompaniesState;
  activities: ActivitiesState;
  ui:         UiState;
}
```

### 6.2 Contacts Store

**`contacts.actions.ts`:**
```typescript
// Load
export const loadContacts = createAction('[Contacts] Load Contacts');
export const loadContactsSuccess = createAction('[Contacts] Load Contacts Success', props<{ contacts: Contact[] }>());
export const loadContactsFailure = createAction('[Contacts] Load Contacts Failure', props<{ error: string }>());

// CRUD
export const loadContact = createAction('[Contacts] Load Contact', props<{ id: string }>());
export const loadContactSuccess = createAction('[Contacts] Load Contact Success', props<{ contact: Contact }>());
export const createContact = createAction('[Contacts] Create Contact', props<{ contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> }>());
export const createContactSuccess = createAction('[Contacts] Create Contact Success', props<{ contact: Contact }>());
export const updateContact = createAction('[Contacts] Update Contact', props<{ contact: Contact }>());
export const updateContactSuccess = createAction('[Contacts] Update Contact Success', props<{ contact: Contact }>());
export const deleteContact = createAction('[Contacts] Delete Contact', props<{ id: string }>());
export const deleteContactSuccess = createAction('[Contacts] Delete Contact Success', props<{ id: string }>());

// UI state
export const setContactsFilter = createAction('[Contacts] Set Filter', props<{ filter: ContactsFilter }>());
export const setContactsSort = createAction('[Contacts] Set Sort', props<{ sort: ContactsSort }>());
export const setContactsPage = createAction('[Contacts] Set Page', props<{ page: number; pageSize: number }>());
export const setSelectedContact = createAction('[Contacts] Set Selected', props<{ id: string | null }>());
```

**`contacts.reducer.ts`:** Use `@ngrx/entity` `EntityAdapter` for contacts collection. Include `filter`, `sort`, `pagination`, `selectedId`, `loading`, `error` in state.

**`contacts.effects.ts`:** Effects for all load/create/update/delete actions using `ContactsService`.

**`contacts.selectors.ts`:**
```typescript
export const selectAllContacts = createSelector(...);
export const selectContactById = (id: string) => createSelector(...);
export const selectFilteredContacts = createSelector(...);
export const selectContactsLoading = createSelector(...);
export const selectContactsPagination = createSelector(...);
export const selectContactsTotalCount = createSelector(...);
```

> Apply the same Store pattern (actions, reducer, effects, selectors) for **Deals**, **Companies**, and **Activities**.

### 6.3 UI State

```typescript
export interface UiState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  globalLoading: boolean;
  notifications: Notification[];
}
```

---

## 7. Core Services

### 7.1 `ContactsService` (`src/app/core/services/contacts.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class ContactsService {
  private apiUrl = '/api/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]>
  getById(id: string): Observable<Contact>
  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Observable<Contact>
  update(contact: Contact): Observable<Contact>
  delete(id: string): Observable<void>
  search(query: string): Observable<Contact[]>
}
```

> Create the same service pattern for `DealsService`, `CompaniesService`, `ActivitiesService`.

### 7.2 `AuthService` (`src/app/core/services/auth.service.ts`)

Simulate auth with localStorage:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  login(email: string, password: string): Observable<User>
  // For demo: any email ending in @arcflow.io with password "demo123" succeeds
  // Returns the matching mock user or defaults to Alex Johnson (admin)

  logout(): void
  getCurrentUser(): Observable<User | null>
  isAuthenticated(): boolean
  hasRole(role: UserRole): boolean
}
```

### 7.3 `NotificationService` (`src/app/core/services/notification.service.ts`)

Wraps Angular Material `MatSnackBar`:
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string): void
  error(message: string): void
  warning(message: string): void
  info(message: string): void
}
```

### 7.4 `ThemeService` (`src/app/core/services/theme.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme$ = new BehaviorSubject<'light' | 'dark'>('light');

  constructor() {
    // On init: read localStorage, then system preference
    const saved = localStorage.getItem('arcflow-theme') as 'light' | 'dark';
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setTheme(saved ?? system);
  }

  setTheme(theme: 'light' | 'dark'): void {
    // Sets data-theme on <html> element
    // Toggles .dark-theme class on <body> for Angular Material
    // Saves to localStorage
  }

  getTheme(): Observable<'light' | 'dark'>
  toggleTheme(): void
}
```

---

## 8. Layout

### 8.1 App Routing (`src/app/app-routing.module.ts`)

```typescript
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./features/contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'deals',
        loadChildren: () => import('./features/deals/deals.module').then(m => m.DealsModule),
      },
      {
        path: 'companies',
        loadChildren: () => import('./features/companies/companies.module').then(m => m.CompaniesModule),
      },
      {
        path: 'activities',
        loadChildren: () => import('./features/activities/activities.module').then(m => m.ActivitiesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

### 8.2 Main Layout Component

**Template structure:**
```html
<div class="app-layout" [class.sidebar-collapsed]="sidebarCollapsed$ | async">
  <nx-sidebar></nx-sidebar>
  <div class="main-content">
    <nx-topbar></nx-topbar>
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

**Styles:**
```scss
.app-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100vh;
  overflow: hidden;
  transition: grid-template-columns var(--transition-normal);

  &.sidebar-collapsed {
    grid-template-columns: var(--sidebar-collapsed-width) 1fr;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  background: var(--color-bg);
}
```

### 8.3 Sidebar Component

**Navigation items:**
```typescript
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: 'dashboard',      route: '/dashboard' },
  { label: 'Contacts',   icon: 'people',          route: '/contacts',   badge: contactCount$ },
  { label: 'Deals',      icon: 'handshake',       route: '/deals',      badge: openDealsCount$ },
  { label: 'Companies',  icon: 'business',        route: '/companies' },
  { label: 'Activities', icon: 'event_note',      route: '/activities' },
  { label: 'Settings',   icon: 'settings',        route: '/settings' },
];
```

**Sidebar behaviors:**
- Show full label + icon when expanded (240px wide)
- Show icon only with tooltip when collapsed (64px)
- Active route highlighted with `--color-primary-subtle` background and `--color-primary` left border
- Collapse/expand toggle button at the bottom of the sidebar
- User avatar + name at the top of the sidebar
- "Arcflow" logo/wordmark at the very top

**Sidebar SCSS:**
```scss
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width var(--transition-normal);

  &.collapsed {
    width: var(--sidebar-collapsed-width);
    .nav-label, .user-info, .logo-text { display: none; }
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  margin: 2px var(--space-2);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  text-decoration: none;

  &:hover { background: var(--color-bg-subtle); color: var(--color-text-primary); }
  &.active {
    background: var(--color-primary-subtle);
    color: var(--color-primary);
    font-weight: 500;
    border-left: 3px solid var(--color-primary);
  }
}
```

### 8.4 Topbar Component

Contains:
- Page title (from router state or injected service)
- Global search input (searches contacts + deals by name, triggers search results dropdown)
- Theme toggle button (sun/moon icon)
- Notification bell icon with unread count badge
- User avatar with dropdown menu (Profile, Settings, Logout)

---

## 9. Login Page

### 9.1 Route: `/login`

**Template:**
- Full-screen split layout: left side is a branded panel (dark blue, Arcflow logo, tagline "Close more deals, faster."), right side is the login form
- Logo at top-left of the form panel
- Heading: "Welcome back" + subheading: "Sign in to your Arcflow account"

**Form fields (Reactive Forms):**
- Email: required, email validator
- Password: required, minLength(6)
- "Remember me" checkbox

**Validators & UX:**
- Show inline error messages below each field on blur
- Disable submit button while loading
- Show spinner inside button while submitting
- On success: navigate to `/dashboard`
- On failure: show error banner "Invalid credentials. Try demo@arcflow.io / demo123"

**Demo credentials hint:** Show a subtle help text below the form: "Demo: demo@arcflow.io / demo123"

---

## 10. Feature: Dashboard

**Route:** `/dashboard`

**Layout:** Grid of stat cards at the top, then two columns of charts, then a recent activity feed at the bottom.

### 10.1 Stat Cards (top row — 4 cards)

| Card | Value | Trend |
|---|---|---|
| Total Contacts | count from store | +X% vs last month |
| Open Deals | count of non-won/lost deals | +X this week |
| Revenue (Won) | sum of won deal values | formatted as $XXk |
| Activities Due Today | count of pending activities due today | X overdue |

Each stat card component (`StatCardComponent`) accepts:
```typescript
@Input() label: string;
@Input() value: string | number;
@Input() icon: string;           // Material icon name
@Input() iconColor: string;      // CSS variable string
@Input() trend?: string;         // e.g. "+12%" or "-3%"
@Input() trendDirection?: 'up' | 'down' | 'neutral';
```

### 10.2 Charts Row (two columns)

**Left — Deals by Stage (Doughnut chart):**
- ng2-charts with Chart.js
- Each stage is a slice colored with its stage color from tokens
- Legend below chart listing stage name + count + value

**Right — Revenue Over Time (Line chart):**
- 6 months of monthly won deal values (generated from mock data)
- Smooth curve, filled area below line in brand-blue with 20% opacity
- Tooltips showing month + total value

### 10.3 Recent Activity Feed (bottom)

Last 10 activities sorted by `createdAt` descending. Each item shows:
- Activity type icon (color-coded)
- Title and description
- Contact name (linked to `/contacts/:id`)
- Time ago (using `TimeAgoPipe`)

### 10.4 Top Deals Table (right column, below charts)

A compact table of the top 5 open deals by value:
- Deal title (linked to `/deals/:id`)
- Contact name
- Stage badge (color-coded)
- Value in USD
- Expected close date

---

## 11. Feature: Contacts

### 11.1 Routes

```
/contacts              → ContactsListComponent
/contacts/new          → ContactFormComponent (create mode)
/contacts/:id          → ContactDetailComponent
/contacts/:id/edit     → ContactFormComponent (edit mode)
```

### 11.2 Contacts List Page (`ContactsListComponent`)

**Toolbar:**
- Page title: "Contacts" with total count in a muted badge
- Search input (debounced 300ms, filters by name/email/company)
- Status filter dropdown (All / Active / Prospect / Customer / Churned)
- Lead source filter dropdown
- "Add Contact" primary button → navigates to `/contacts/new`
- View toggle: Table view vs Card grid view

**Table View (Angular Material `MatTable`):**

Columns: Avatar+Name | Email | Company | Status Badge | Lead Source | Last Contacted | Owner | Actions (3-dot menu)

- Sort on: Name, Company, Status, Last Contacted
- Paginator: 10/25/50 per page
- Row hover highlights with subtle background
- Clicking a row (not the action menu) navigates to the contact detail page
- Action menu items: View, Edit, Delete (with confirm dialog)
- Status badge colors:
  - active → success green
  - prospect → info blue
  - customer → primary blue
  - churned → danger red
  - inactive → muted gray

**Card Grid View:**
- 3-column responsive grid (1 on mobile, 2 on tablet, 3 on desktop)
- Each card: avatar (with initials fallback), name, job title, company, email, phone, status badge, "View" button

**Empty State:** If no contacts match the filter, show `EmptyStateComponent` with an icon, "No contacts found" message, and "Add Contact" button.

### 11.3 Contact Detail Page (`ContactDetailComponent`)

**Layout:** Two-column (left sidebar 1/3, right main content 2/3)

**Left sidebar:**
- Large avatar (80px) with initials fallback
- Full name (h2), job title, company (linked to company detail)
- Status badge
- Contact info section: email (mailto link), phone (tel link), website
- Social links: LinkedIn, Twitter icons
- Tags list with `mat-chip` components
- "Edit" button → navigates to edit page
- "Delete" button (with confirm dialog)

**Right main content — tabs:**

1. **Overview tab**
   - Notes section (textarea that auto-saves on blur using debounce)
   - Address section
   - Lead source + Created date + Last contacted date

2. **Deals tab**
   - List of all deals linked to this contact
   - Each deal shows: title, stage badge, value, expected close date
   - "Add Deal" button → opens create deal dialog with contact pre-filled

3. **Activities tab**
   - Timeline of all activities for this contact (sorted newest first)
   - Each item: activity type icon, title, description, date
   - "Log Activity" button → opens activity form dialog

4. **Files tab** (static UI only)
   - Empty state with "No files attached" message
   - Upload button that shows a "Coming soon" snackbar

### 11.4 Contact Form (`ContactFormComponent`)

Used for both create and edit. Detect mode from route params.

**Form sections:**

*Basic Info (always visible)*
- First Name (required), Last Name (required)
- Email (required, email validator), Phone
- Job Title, Company (autocomplete from Companies list)
- Status (select), Lead Source (select)

*Address (collapsible accordion section)*
- Street, City, State, Country, Zip

*Social Links (collapsible accordion section)*
- LinkedIn URL, Twitter handle, Website URL

*Tags*
- `mat-chip-list` with text input to add new tags on Enter

*Notes*
- Multi-line textarea

**Form validation:**
- Required fields highlighted on submit attempt
- Email format validation
- Show field-level error messages: "Email is required", "Please enter a valid email"

**Actions:**
- "Cancel" → navigates back
- "Save Contact" → dispatches NgRx create/update action → navigates to detail page on success
- Show loading spinner on the Save button while saving

---

## 12. Feature: Deals

### 12.1 Routes

```
/deals              → DealsComponent (defaults to pipeline view)
/deals/new          → DealFormComponent (create mode)
/deals/:id          → DealDetailComponent
/deals/:id/edit     → DealFormComponent (edit mode)
```

### 12.2 Deals Page (`DealsComponent`)

**Toolbar:**
- Page title: "Deals" with total pipeline value shown (e.g. "Pipeline: $1.2M")
- Search input
- Owner filter, Stage filter
- "Add Deal" primary button
- View toggle: **Kanban** (default) vs **List**

### 12.3 Kanban Pipeline View

**Columns:** One column per `DealStage`: Lead → Qualified → Proposal → Negotiation → Won → Lost

Each column header shows:
- Stage name
- Deal count in that stage
- Total value of deals in that stage
- Colored top border using the stage color token

Each deal card shows:
- Deal title (bold)
- Contact name + company (small, muted)
- Value formatted as currency (e.g. "$24,500")
- Priority indicator dot (red/orange/green)
- Expected close date (turns red if overdue)
- Owner avatar

**Drag and Drop (Angular CDK):**
- Cards are draggable between columns
- `cdkDrag` on each card, `cdkDropList` on each column
- `cdkDropListGroup` on the kanban container
- On drop: dispatch `updateDeal` action with new stage
- Animate card move with CDK default animations
- While dragging: card shows placeholder in original position, dragged card has slight opacity + shadow

**Won/Lost columns:**
- Cards in Won column have a subtle green tint background
- Cards in Lost column are visually muted (lower opacity)

### 12.4 Deal List View

Same pattern as Contacts list but with these columns:
- Title | Contact | Company | Stage Badge | Value | Priority | Close Date | Owner | Actions

### 12.5 Deal Detail Page

Same two-column layout as Contact detail.

**Left sidebar:**
- Deal title (h2)
- Value (large, prominent — e.g. "$24,500")
- Stage badge (large)
- Probability slider (0–100%) — interactive, updates on drag

**Right content — tabs:**
1. **Overview** — notes, close dates, created date, owner
2. **Contact** — the linked contact card with quick info
3. **Activities** — timeline same as contact activities tab
4. **History** — a static list of "stage changed from X to Y" log entries

### 12.6 Deal Form

Similar pattern to Contact form:
- Title (required), Contact (required, autocomplete), Company
- Stage (required, select), Value (required, number input with $ prefix)
- Priority (radio group: Low / Medium / High)
- Probability (slider 0–100)
- Expected Close Date (date picker)
- Tags, Notes

---

## 13. Feature: Companies

### 13.1 Routes

```
/companies          → CompaniesListComponent
/companies/new      → CompanyFormComponent
/companies/:id      → CompanyDetailComponent
/companies/:id/edit → CompanyFormComponent
```

### 13.2 Companies List Page

Same pattern as Contacts list (table + card views). Table columns:
- Logo/Monogram + Name | Industry | Size | Contacts Count | Deals Count | Revenue | Owner | Actions

### 13.3 Company Detail Page

**Left sidebar:**
- Company logo (or letter monogram with brand color)
- Company name, industry badge, size badge
- Website, phone, email
- Address

**Right tabs:**
1. **Overview** — revenue, notes
2. **Contacts** — list of all contacts at this company (mini cards)
3. **Deals** — list of all deals linked to this company
4. **Activities** — combined activity timeline

### 13.4 Company Form

Fields: Name (required), Industry (required, select), Size (required, select), Website, Phone, Email, Revenue, Address (collapsible), Notes.

---

## 14. Feature: Activities

### 14.1 Routes

```
/activities         → ActivitiesListComponent
```

### 14.2 Activities Page

**Toolbar:**
- Title: "Activities"
- Type filter: All / Call / Email / Meeting / Task / Note
- Status filter: All / Pending / Completed / Cancelled
- Date range filter (from / to date pickers)
- "Log Activity" primary button

**Layout:** Two-panel — left is the activity list, right is a detail preview pane (shows selected activity detail inline without navigation).

**Activity List:**
Each row:
- Type icon (color-coded: call=blue, email=purple, meeting=green, task=orange, note=gray)
- Title and description (truncated)
- Linked contact name (click navigates to contact)
- Due date (red if overdue and pending)
- Status chip: Pending (warning) / Completed (success) / Cancelled (muted)
- Quick action: "Mark Complete" button on hover for pending activities

**Right preview pane:**
When an activity is selected:
- Full title
- Description (full, not truncated)
- Linked contact card (name, email, avatar)
- Linked deal (if any)
- Due date and status
- "Edit" and "Delete" buttons

### 14.3 Log Activity Dialog

A `MatDialog` component:
```
Type (required, icon radio group: Call / Email / Meeting / Task / Note)
Title (required)
Description (textarea)
Contact (autocomplete)
Deal (autocomplete, filtered by selected contact's deals)
Status (select: Pending / Completed)
Due Date (date picker, shown only if type is Call/Meeting/Task)
```

---

## 15. Feature: Settings

### 15.1 Route: `/settings`

**Sections (left-nav tabs within the page):**

1. **Profile**
   - Edit name, email, department
   - Upload avatar (UI only — show preview with `FileReader`, don't actually upload)
   - Save button

2. **Appearance**
   - Theme toggle: Light / Dark / System (three radio cards with a visual preview icon)
   - Accent color picker: 5 preset brand colors as clickable swatches

3. **Notifications** (UI only)
   - Toggle switches for: Email notifications, In-app notifications, Deal reminders, Activity reminders
   - Save preferences (persists to localStorage)

4. **Team** (read-only display)
   - Table of mock team members: Avatar, Name, Email, Role badge
   - "Invite Member" button → shows "Coming soon" snackbar

5. **About**
   - Arcflow version, build date
   - Link to GitHub repository
   - License: MIT

---

## 16. Shared Components

### 16.1 `PageHeaderComponent`

```typescript
@Input() title: string;
@Input() subtitle?: string;
@Input() breadcrumbs?: { label: string; route?: string }[];
```

Renders `<nav>` breadcrumbs above and `<h1>` title + optional `<p>` subtitle.

### 16.2 `StatCardComponent` (see Section 10.1)

### 16.3 `EmptyStateComponent`

```typescript
@Input() icon: string;           // Material icon
@Input() title: string;          // e.g. "No contacts found"
@Input() description?: string;
@Input() actionLabel?: string;   // e.g. "Add Contact"
@Output() action = new EventEmitter<void>();
```

Centered column layout with icon (64px, muted color), title, description, optional action button.

### 16.4 `ConfirmDialogComponent`

```typescript
// Opened via MatDialog
// Data interface:
interface ConfirmDialogData {
  title: string;          // e.g. "Delete Contact"
  message: string;        // e.g. "Are you sure you want to delete John Smith? This cannot be undone."
  confirmLabel?: string;  // default "Delete"
  cancelLabel?: string;   // default "Cancel"
  destructive?: boolean;  // if true, confirm button is red
}
```

Returns `true` from dialog if confirmed, `false` if cancelled.

### 16.5 `AvatarComponent`

```typescript
@Input() src?: string;
@Input() name?: string;       // Used to generate initials
@Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
@Input() shape: 'circle' | 'square' = 'circle';
```

Size px: sm=24, md=32, lg=40, xl=56.
Deterministic background color from name hash (6 colors from brand palette).

### 16.6 Pipes

**`InitialsPipe`:** `"John Smith" → "JS"`, `"Sarah" → "S"`

**`TimeAgoPipe`:** `ISO date → "2 hours ago"`, `"3 days ago"`, `"just now"`. Uses `date-fns` `formatDistanceToNow`.

**`CurrencyFormatPipe`:** `24500 → "$24,500"`, `1200000 → "$1.2M"`. Abbreviate values ≥1M to "M", ≥1K to "K".

---

## 17. Guards & Interceptors

### 17.1 `AuthGuard`

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
```

### 17.2 `LoadingInterceptor`

```typescript
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // Increments/decrements a counter on each HTTP request start/complete
  // Dispatches setGlobalLoading(true/false) to NgRx store
  // The topbar shows a thin progress bar (using MatProgressBar in indeterminate mode) when loading
}
```

---

## 18. Responsive Design

All pages must be usable on tablet (768px) and mobile (375px):

- **Sidebar:** On screens < 768px, sidebar is hidden by default and shown as an overlay drawer (use `MatSidenav`)
- **Kanban board:** On mobile, show one column at a time with horizontal scroll or swipe tabs
- **Tables:** On mobile, switch to card-list layout (hide table, show cards)
- **Forms:** Stack all form fields vertically on mobile (remove grid layout)
- **Topbar:** On mobile, hide page title text; show hamburger menu icon to open sidebar

Use Angular CDK `BreakpointObserver` for programmatic breakpoint detection.

---

## 19. Testing

### 19.1 Unit Tests

Write unit tests for:

**Services:**
- `ContactsService`: test all CRUD methods return correct HTTP calls
- `AuthService`: test login/logout/isAuthenticated
- `ThemeService`: test theme switching and persistence

**Store:**
- Reducers: test each action produces correct state shape
- Selectors: test filtered/sorted selectors return correct data

**Pipes:**
- `TimeAgoPipe`: test "just now", "X minutes ago", "X days ago"
- `CurrencyFormatPipe`: test $999, $1K, $1M formatting
- `InitialsPipe`: test single name, double name, empty string

**Components:**
- `StatCardComponent`: renders label, value, trend correctly
- `ConfirmDialogComponent`: emits correct value on confirm/cancel
- `AvatarComponent`: shows image when src provided, shows initials when name provided

### 19.2 Test File Location

Each spec file lives alongside its source:
```
contacts.service.ts
contacts.service.spec.ts
contacts.reducer.ts
contacts.reducer.spec.ts
```

---

## 20. Performance

Apply these Angular performance best practices throughout the app:

1. **OnPush Change Detection** — all components use `ChangeDetectionStrategy.OnPush`
2. **TrackBy functions** — all `*ngFor` directives use a `trackBy` function
3. **Lazy loading** — all feature modules are lazy-loaded (already configured in routing)
4. **Async pipe** — all observables in templates use `async` pipe (no `.subscribe()` in components)
5. **Memoized selectors** — all NgRx selectors use `createSelector` for memoization
6. **Virtual scrolling** — use `cdk-virtual-scroll-viewport` in the contacts and activities lists when count > 50

---

## 21. GitHub Actions CI (`/.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build -- --configuration production
      - run: npm test -- --watch=false --browsers=ChromeHeadless
```

---

## 22. README (`README.md`)

Must include:

1. **Arcflow** title + one-line description: "A production-grade Enterprise CRM built with Angular 18, NgRx, and Angular Material."
2. **Live demo link** (placeholder): `https://arcflow.vercel.app`
3. **Screenshot placeholder:** `![Arcflow Dashboard](./docs/screenshot.png)`
4. **Features list:**
   - ✅ Contacts management (CRUD, search, filter)
   - ✅ Deals pipeline (Kanban drag-and-drop)
   - ✅ Companies management
   - ✅ Activity feed & logging
   - ✅ Dashboard with charts
   - ✅ Dark / light mode
   - ✅ NgRx state management
   - ✅ Lazy-loaded feature modules
   - ✅ Fully responsive (mobile + tablet)
5. **Tech stack badges** (shields.io)
6. **Getting started:**
   ```bash
   git clone https://github.com/yourusername/arcflow.git
   npm install
   ng serve
   # Visit http://localhost:4200
   # Login: demo@arcflow.io / demo123
   ```
7. **Architecture section** — brief explanation of the folder structure and NgRx store design
8. **License:** MIT

---

## 23. Implementation Order

Claude Code must build in this exact sequence:

1. **Project scaffold** — `ng new`, install dependencies
2. **Design tokens + global styles** — `_tokens.scss`, `_material-theme.scss`, `styles.scss`
3. **Data models** — all interfaces in `core/models/`
4. **Mock data + in-memory API** — `mock-data.ts`, `in-memory-data.service.ts`
5. **Core services** — `AuthService`, `ThemeService`, `NotificationService`
6. **NgRx store** — app state, then contacts store (as template), then deals/companies/activities stores
7. **Shared module** — all shared components, pipes, directives
8. **Layout module** — `MainLayoutComponent`, `SidebarComponent`, `TopbarComponent`
9. **Login page** — `LoginComponent` with reactive form
10. **Auth guard + loading interceptor**
11. **Feature: Dashboard** — stat cards, charts, activity feed
12. **Feature: Contacts** — list, detail, form
13. **Feature: Deals** — kanban pipeline, list, detail, form
14. **Feature: Companies** — list, detail, form
15. **Feature: Activities** — list + detail pane, log activity dialog
16. **Feature: Settings** — all 5 setting sections
17. **Responsive styles** — mobile/tablet breakpoints across all features
18. **Unit tests** — services, reducers, pipes, key components
19. **CI workflow** — `.github/workflows/ci.yml`
20. **README** — complete `README.md`

---

## 24. Quality Checklist

Before any component or feature is considered complete, verify:

- [ ] `ChangeDetectionStrategy.OnPush` applied
- [ ] All observables consumed via `async` pipe (no subscriptions in component class unless destroyed via `takeUntilDestroyed`)
- [ ] All `*ngFor` directives have `trackBy`
- [ ] No hardcoded colors — only CSS variables or Material theme tokens
- [ ] Dark mode: element looks correct in both `[data-theme="light"]` and `[data-theme="dark"]`
- [ ] Mobile responsive: tested at 375px viewport
- [ ] ARIA attributes on all interactive custom elements
- [ ] NgRx: loading and error states handled in every effect
- [ ] Forms: all required validators active, error messages visible on submit
- [ ] TypeScript: no `any` types, all properties typed

---

*End of PRD — Arcflow v1.0*
