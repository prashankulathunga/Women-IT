# Aruna — WomenIT

**A career-progression platform for women in Sri Lanka's IT industry.**

Aruna exists to help women who are *already* working in Sri Lankan tech advance in
their careers and stay in the industry. It brings together three things that are hard
to find in one place: honest career stories from women a few steps ahead, a curated job
board that surfaces flexibility and seniority rather than burying them, and training
workshops from organisations invested in this work. Built in alignment with SLASSCOM
and Women in Tech Sri Lanka.

---

## Getting started

```bash
npm install
```

```bash
npm run dev
```

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server on `localhost:5173`      |
| `npm run build`   | Production build to `dist/`              |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | ESLint across the project                |

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · daisyUI 5 · React Router 7. No state-management
or form library: the shared `useForm`, `useAsync` and `useFilters` hooks cover what the
product needs without adding dependencies.

---

## The three account types

Everything role-aware keys off `src/constants/roles.js` — never off raw strings.

| Role      | Sees                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `member`  | Job board, applications, mentors, mentor requests, blogs, workshops     |
| `mentor`  | Incoming mentee requests, job board, blogs, workshops                   |
| `company` | Job postings, applicants, blogs, workshops                              |

A new account signs up, picks a role, then completes a role-specific onboarding wizard
that collects the profile data everything else matches against. `ProtectedRoute` holds
users at `/onboarding` until that profile exists.

---

## Architecture

```
src/
├── app/
│   ├── providers/     AppProviders, AuthProvider, ToastProvider (+ their contexts)
│   └── router/        RouteGuards (Protected / PublicOnly / Role), ScrollToTop
├── components/
│   ├── ui/            Design-system primitives — Button, Input, Card, Modal, Badge …
│   ├── layout/        Container, Section, PageHeader
│   ├── common/        ErrorBoundary, Logo, FilterBar, SchemaField, FullPageLoader
│   └── icons/         One stroke-based icon set, referenced by name
├── layouts/           PublicLayout, AuthLayout, DashboardLayout (+ partials)
├── features/          Domain modules: jobs, mentorship, learning, profile, dashboard
├── pages/             Route-level screens — public / auth / app
├── services/          Mock API — one file per domain, all through mockClient
├── data/              Seed content (jobs, mentors, blogs, workshops)
├── hooks/             useAuth, useForm, useAsync, useFilters, useToast …
├── constants/         roles, routes, navigation, options (controlled vocabularies)
└── lib/               cn, format, storage, validators
```

### Rules the codebase holds to

**Layers point one way.** `pages → features → components/ui → lib`. A UI primitive never
imports a feature; a feature never imports a page. Services are the only module that
touches persistence.

**The service layer is swappable.** Every service call goes through
`services/mockClient.js`, which simulates latency and error shape. When a real backend
lands, only the service bodies change — no component or hook knows how data arrives.

**Vocabularies live in one place.** `constants/options.js` holds every controlled list
(tracks, levels, work modes, statuses). A job posting and a member profile match because
they are filling in the same values.

**Profile fields are data, not markup.** `features/profile/profileFields.js` defines what
a profile contains per role, with its validation. The onboarding wizard and the profile
editor both render from it through `SchemaField`, so the two can never drift.

**Navigation is data.** `constants/navigation.js` declares which nav items each role
sees; the desktop rail and the mobile drawer render from the same list.

**One list-page shape.** A list screen is `useFilters` + `useAsync` + `FilterBar` +
a card + `Pagination`, and always handles four states: loading (skeletons), error
(retry), empty (a way forward), and content.

**One design system.** Colour, type, radius and elevation are declared once as Tailwind
v4 `@theme` tokens in `index.css`. Components consume the generated utilities
(`bg-brand-900`, `text-ink-600`, `rounded-card`, `shadow-raised`) and never hard-code hex.

---

## Notes on the mock backend

There is no server yet. Accounts, applications, mentor requests and workshop
registrations persist to `localStorage` under the `aruna:` namespace so the whole
product can be demonstrated end to end.

Credentials are digested rather than stored verbatim, but **this is not authentication** —
it exists so the UI can be built against realistic flows. Real identity checks belong on
the server.
