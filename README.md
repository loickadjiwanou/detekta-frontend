# detekta-frontend

The React SPA (Single-Page Application) for **Detekta** — an automated security audit platform. This interface lets users create and monitor security audits, watch live scan logs in a real-time terminal, and explore AI-generated vulnerability reports for web applications, REST APIs, mobile apps (APK/IPA), and backend code.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Pages & Features](#pages--features)
- [State Management](#state-management)
- [Routing](#routing)
- [API Client](#api-client)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Theming](#theming)
- [UI Component Library](#ui-component-library)
- [Forms & Validation](#forms--validation)
- [Real-Time Scanning (WebSocket)](#real-time-scanning-websocket)
- [Build & Production](#build--production)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Backend Integration](#backend-integration)
- [Changelog](#changelog)
- [License](#license)

---

## Overview

`detekta-frontend` is a fully client-rendered React 19 application built with Create React App + CRACO. It communicates with `detekta-backend` over REST and WebSocket.

| Capability | How it works |
|---|---|
| Security audit creation | Multi-step form with type-specific fields (web / API / mobile / backend) |
| Real-time scan logs | WebSocket connection streams live terminal output during scans |
| Security reports | Interactive report viewer with finding filters, severity badges, and AI analysis sections |
| PDF export | Triggers a backend PDF generation endpoint with multi-page support and security escaping |
| Domain & Tracker analysis| Identification of external domains and 3rd-party trackers (Google Analytics, Pixels, etc.) |
| Mobile uploads | Support for APK/IPA/AAB files up to 200MB |
| Multi-language UI | i18next with English and French locales |
| Dark / light theme | `next-themes` + Tailwind CSS dark mode (class strategy) |
| User settings | Claude API key management, theme toggle, language selector |
| Auth | JWT access + refresh token flow handled transparently by an Axios interceptor |

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React | 19.0.0 |
| Routing | React Router DOM | v7.5.1 |
| Global state | Zustand | 5.0.12 |
| Server state / caching | TanStack React Query | v5.97.0 |
| HTTP client | Axios | 1.8.4 |
| Form management | React Hook Form | 7.56.2 |
| Schema validation | Zod | 3.24.4 |
| UI primitives | Radix UI | (full suite — 26 packages) |
| Component system | shadcn/ui | (components.json) |
| Styling | Tailwind CSS | 3.4.17 |
| Animations | Framer Motion | 12.38.0 |
| Charts | Recharts | 3.6.0 |
| Icons | Lucide React | 0.507.0 |
| Notifications / toasts | Sonner | 2.0.3 |
| i18n | i18next + react-i18next | 26.0.4 / 17.0.2 |
| Theming | next-themes | 0.4.6 |
| Date utilities | date-fns | 4.1.0 |
| Build tool | Create React App + CRACO | 5.0.1 / 7.1.0 |
| Package manager | Yarn | 1.22.22 |

---

## Project Structure

```
detekta-frontend/
├── package.json
├── yarn.lock
├── .env.example                   # Environment variables template
├── .gitignore
├── tailwind.config.js             # Tailwind CSS configuration
├── craco.config.js                # CRA overrides (path aliases, etc.)
├── components.json                # shadcn/ui configuration
├── jsconfig.json                  # JS path aliases for VSCode
├── postcss.config.js
│
├── public/
│   └── index.html                 # HTML shell
│
└── src/
    ├── index.js                   # React DOM root
    ├── App.js                     # Router setup + route definitions
    ├── i18n.js                    # i18next initialisation (EN/FR)
    │
    ├── pages/
    │   ├── Landing.jsx            # Public marketing / hero page
    │   ├── Login.jsx              # Sign-in form
    │   ├── Register.jsx           # Sign-up form
    │   ├── Dashboard.jsx          # Overview: stats, recent audits, shortcuts
    │   ├── NewAudit.jsx           # Multi-step audit creation form
    │   ├── AuditDetail.jsx        # Single audit — live logs, status, test results
    │   ├── AuditsList.jsx         # Paginated, filterable list of all audits
    │   ├── Report.jsx             # Interactive security report viewer
    │   ├── Archives.jsx           # Archived audits (restore / delete)
    │   ├── Settings.jsx           # Theme, language, personal Claude API key
    │   └── LegalPage.jsx          # Privacy policy / Terms of service
    │
    ├── components/
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx   # Authenticated page wrapper
    │   │   ├── Sidebar.jsx           # Left navigation
    │   │   ├── Topbar.jsx            # Top bar (user menu, breadcrumbs)
    │   │   └── PageTransition.jsx    # Framer Motion page transitions
    │   │
    │   ├── audit/
    │   │   ├── AuditCard.jsx         # Audit preview card (used in lists)
    │   │   ├── ScoreGauge.jsx        # Circular security score widget (0–100)
    │   │   ├── SeverityBadge.jsx     # Colour-coded severity label
    │   │   ├── TerminalLog.jsx       # Scrolling live-scan terminal output
    │   │   ├── StepIndicator.jsx     # Multi-step progress indicator
    │   │   ├── LiveTestsModal.jsx    # Popup with real-time test results
    │   │   └── AvailableTestsModal.jsx
    │   │
    │   ├── common/
    │   │   ├── ChangelogModal.jsx    # What's new popup
    │   │   └── ContactModal.jsx      # Contact form modal
    │   │
    │   └── ui/                       # shadcn/ui re-exported components (49 components)
    │       └── (Button, Card, Dialog, Sheet, Badge, Table, Tooltip, etc.)
    │
    ├── services/
    │   └── api.js                    # Axios instance + silent JWT refresh interceptor
    │
    ├── store/
    │   ├── authStore.js              # Zustand: user, tokens, login/logout
    │   └── settingsStore.js          # Zustand: theme, language preferences
    │
    ├── hooks/
    │   └── (custom React hooks)
    │
    ├── locales/
    │   ├── en/                       # English translation JSON files
    │   └── fr/                       # French translation JSON files
    │
    ├── lib/
    │   └── (cn() helper, utility functions)
    │
    ├── types/
    │   └── (JSDoc type definitions)
    │
    └── constants/
        └── (scan types, severity levels, app-wide constants)
```

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18 LTS or 20 LTS |
| Yarn | 1.22 |
| Running `detekta-backend` | — |

---

## Local Development Setup

### 1. Enter the frontend directory

```bash
cd detekta/detekta-frontend
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with the backend URL:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ENV=development
```

> The backend runs on port `8001` by default when started with `uvicorn server:app --port 8001`.

### 4. Start the development server

```bash
yarn start
```

The app opens at `http://localhost:3000` with hot-reload on file changes.

---

## Environment Variables

All variables **must** be prefixed with `REACT_APP_` to be embedded in the React bundle at build time.

| Variable | Required | Default | Description |
|---|---|---|---|
| `REACT_APP_BACKEND_URL` | **Yes** | — | Base URL of the FastAPI backend (no trailing slash). Example: `http://localhost:8001` |
| `REACT_APP_ENV` | No | `development` | `development` \| `production` \| `staging` — informational only |
| `REACT_APP_ENABLE_DEEP_SCAN` | No | `false` | Feature flag — show "Deep" scan depth option in the UI |
| `REACT_APP_ENABLE_MOBILE_AUDIT` | No | `true` | Feature flag — enable the Mobile audit type |
| `REACT_APP_SENTRY_DSN` | No | — | Sentry error reporting DSN |
| `REACT_APP_POSTHOG_KEY` | No | — | PostHog analytics project API key |
| `REACT_APP_POSTHOG_HOST` | No | — | PostHog instance URL |

> **Important:** Variables are baked into the bundle at build time (`yarn build`). Changing them in production requires a rebuild.

---

## Pages & Features

### Public pages (no authentication required)

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Marketing hero page with feature overview and call-to-action |
| Login | `/login` | Email + password sign-in with form validation |
| Register | `/register` | Account creation with Zod-validated form |
| Legal | `/legal/:page` | Privacy policy and terms of service |

### Authenticated pages (JWT required)

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Stats cards, recent audits, quick-start shortcuts |
| New Audit | `/audits/new` | Step-by-step form: choose type → configure target → start scan |
| Audits List | `/audits` | Filterable / sortable list of all audits with status badges |
| Audit Detail | `/audits/:id` | Live scan status, terminal log stream, test results grid |
| Report | `/audits/:id/report` | Full security report: findings, severity filters, AI analysis, PDF export |
| Archives | `/archives` | Archived audits with restore and permanent-delete actions |
| Settings | `/settings` | Language picker, theme toggle, personal Claude API key |

---

## State Management

Two Zustand stores cover global client state:

### `authStore.js`

```js
{
  user,             // { id, email, name, role }
  accessToken,      // short-lived JWT string
  isAuthenticated,  // boolean
  login(credentials),
  logout(),
  setTokens(access, refresh)
}
```

### `settingsStore.js`

```js
{
  theme,      // "light" | "dark" | "system"
  language,   // "en" | "fr"
  setTheme(t),
  setLanguage(l)
}
```

Server state (audit lists, report data, etc.) is managed by **TanStack React Query**, which handles caching, background refetching, and loading/error states declaratively — no manual `useEffect` data fetching needed in pages.

---

## Routing

`App.js` defines the route tree using React Router v7:

- **Public routes** render with a minimal layout (no sidebar).
- **Authenticated routes** are wrapped in `<DashboardLayout>` which includes `<Sidebar>` and `<Topbar>`.
- **Route guards** check `isAuthenticated` from `authStore` and redirect unauthenticated users to `/login`.
- **Page transitions** use Framer Motion's `AnimatePresence` via `<PageTransition>`.

---

## API Client

`src/services/api.js` exports a pre-configured **Axios** instance:

- Base URL set from `REACT_APP_BACKEND_URL`
- `Authorization: Bearer <token>` header attached automatically on every request
- **Silent refresh interceptor** — on `401` responses, calls `/api/auth/refresh` transparently, retries the original request with the new access token, and logs the user out only if refresh also fails
- Response errors are normalised before being thrown to calling code

---

## Internationalisation (i18n)

The app ships with **English** (`en`) and **French** (`fr`) locales, powered by i18next.

Translation files live in `src/locales/en/` and `src/locales/fr/`. Each JSON file maps to a namespace (e.g. `common.json`, `audit.json`, `report.json`).

Usage in components:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('audit');
  return <h1>{t('newAudit.title')}</h1>;
}
```

Language preference is persisted in `settingsStore` (localStorage) and can be changed at any time from the Settings page without a page reload.

---

## Theming

Theming is powered by **next-themes** (class strategy) combined with Tailwind's `dark:` variant.

- The `settingsStore` holds the current theme preference (`light`, `dark`, or `system`).
- `<ThemeProvider>` from `next-themes` applies or removes the `dark` class on `<html>`.
- Tailwind `dark:` prefixes are used throughout all components.
- The user's preference is saved to localStorage and restored on next visit.

---

## UI Component Library

The project uses **Radix UI primitives** wrapped and styled via the **shadcn/ui** convention.

- 49 components live in `src/components/ui/`
- Each is a thin Radix wrapper with Tailwind classes and `class-variance-authority` (CVA) variants
- `cn()` utility (from `src/lib/utils.js`) merges Tailwind classes safely using `clsx` + `tailwind-merge`

To add a new shadcn component:

```bash
npx shadcn@latest add <component-name>
```

---

## Forms & Validation

All forms use **React Hook Form** with a **Zod** resolver for schema-based, type-safe validation.

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const form = useForm({ resolver: zodResolver(schema) });
```

Validation errors render inline below each field. The submit button is disabled until the form passes validation.

---

## Real-Time Scanning (WebSocket)

When an audit is in progress, `AuditDetail.jsx` opens a WebSocket connection to the backend:

```
WS <REACT_APP_BACKEND_URL>/api/ws/audits/<audit_id>?token=<accessToken>
```

- The JWT access token is passed as a `token` query parameter.
- Incoming messages are parsed and appended to the `<TerminalLog>` component.
- The terminal auto-scrolls to the latest line.
- The connection closes cleanly when the backend emits a `done` event.

---

## Build & Production

### Generate a production build

```bash
yarn build
```

Outputs a static bundle to the `build/` directory — HTML, CSS, and JS ready to be served from any web server or CDN.

### Preview the build locally

```bash
npx serve -s build -p 5000
```

### Key optimisations included

- Code splitting via React Router lazy imports
- Tree-shaking via Webpack (bundled by CRA)
- Tailwind CSS purge — only utility classes actually used in `src/` are included in the final CSS bundle
- Gzip / Brotli compression should be configured at the web server level (see `deployment.md`)

---

## Testing

```bash
# Run tests in watch mode (development)
yarn test

# Run tests once — CI mode
CI=true yarn test
```

Tests use **React Testing Library** + **Jest** (included via `react-scripts`).

---

## Code Quality

```bash
# Lint with ESLint
npx eslint src/
```

ESLint is configured with:
- `eslint-plugin-react` + `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y` (accessibility rules)
- `eslint-plugin-import` (import ordering)

---

## Backend Integration

This application depends on `detekta-backend` for all data and scanning operations.

- **Source code**: [detekta-backend](../detekta-backend)
- **API docs** (Swagger UI): `http://your-backend-url/docs`
- **API docs** (ReDoc): `http://your-backend-url/redoc`
- **GitHub repository**: [github.com/loickadjiwanou/detekta](https://github.com/loickadjiwanou/detekta)

---

## Changelog

For the full history of changes across the entire Detekta project, refer to the [Changelog section in the backend README](https://github.com/loickadjiwanou/detekta/blob/main/detekta-backend/README.md#changelog).

---

## License

MIT — see [LICENCE](LICENCE)

Copyright © 2026 Detekta Inc. All rights reserved.
