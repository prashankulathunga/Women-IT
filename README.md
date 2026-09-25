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

## Account types

Everything role-aware keys off `src/constants/roles.js` — never off raw strings.

| Role      | Sees                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `member`  | Job board, applications, mentors, mentor requests, blogs, workshops     |
| `mentor`  | Incoming mentee requests, job board, blogs, workshops                   |
| `company` | Job postings, applicants, blogs, workshops                              |
| `admin`   | The approval queue. Staff-only; never offered in the signup picker      |

A new account signs up, picks a role, then completes a role-specific onboarding wizard
that collects the profile data everything else matches against.

---

## Member verification (admin-gated signup)

`member` is the woman-in-tech account, and it is the only role that is identity
checked. Signing up as a member requires a **live webcam capture** (`react-webcam` —
camera only, no file upload), after which the account sits at `approvalStatus:
"pending"` until an administrator approves it.

The gate order is enforced in one place, `app/router/landingRoute.js`:

```
verification  →  onboarding  →  product
```

Verification comes first on purpose: there is no point asking someone to fill in a
profile on an account we may never activate.

| `approvalStatus` | Who gets it              | Where they land        |
| ---------------- | ------------------------ | ---------------------- |
| `not_required`   | mentor, company, admin   | Normal flow, unchanged |
| `pending`        | member, awaiting review  | `/awaiting-approval`   |
| `declined`       | member, refused          | `/account-declined`    |
| `approved`       | member, cleared          | Normal flow            |

Guards run on every navigation, so a member who signs up, closes the tab and logs back
in a day later while still pending lands on `/awaiting-approval` again — never the
dashboard.

### Live sync without a backend

When an admin approves, the waiting member is moved on automatically, with no refresh.
Two overlapping mechanisms do this (see `hooks/useApprovalWatch.js`):

1. **The `storage` event.** The browser fires it in every *other* tab of the origin when
   localStorage is written, so the admin's approval reaches the member's tab
   immediately. It does **not** fire in the tab that performed the write — which is why
   there is a second mechanism.
2. **A 4-second poll**, plus a re-check on tab focus. This covers same-tab testing,
   separate windows, and engines that throttle the event. It only runs while a user is
   actually sitting on a verification screen.

Everything writes through `services/userStore.js`, the single source of truth for the
users table — that is what makes the cross-tab signal reliable.

### Documented decisions

These were open questions in the brief; the answers chosen here are:

- **Decline is reversible.** The most common cause is a dark or blurred capture, and a
  permanent lockout for that is unfair and generates support load. A declined member can
  retake their photo once and re-enter the queue; an admin can also re-approve directly
  from the Decided tab. The one exception is the *"Not eligible"* reason, which hides the
  retake path and points the person at a human instead.
- **The queue persists** in localStorage and survives admin logout. It is sorted newest
  first and split into "Awaiting review" and "Decided" so decisions stay auditable.
- **Routing and state** reuse what already existed — React Router 7 and the `AuthProvider`
  context. No second state system was introduced.

### Signing in as the administrator

Staff cannot self-register, so one admin is seeded on first load:

```
admin@aruna.lk  /  Admin2026!
```

Change this before any real deployment — it is a demo credential in client-side code.

---

## Architecture

```
src/
├── app/
│   ├── providers/     AppProviders, AuthProvider, ToastProvider (+ their contexts)
│   └── router/        RouteGuards, landingRoute (gate order), ScrollToTop
├── components/
│   ├── ui/            Design-system primitives — Button, Input, Card, Modal, Badge …
│   ├── layout/        Container, Section, PageHeader
│   ├── common/        ErrorBoundary, Logo, FilterBar, SchemaField, FullPageLoader
│   └── icons/         One stroke-based icon set, referenced by name
├── layouts/           PublicLayout, AuthLayout, DashboardLayout (+ partials)
├── features/          Domain modules: jobs, mentorship, learning, profile,
│                       verification, dashboard
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
(`bg-brand-600`, `text-ink-600`, `rounded-card`, `shadow-raised`) and never hard-code hex.

### Brand palette

The purple ramp is anchored on three colours; everything else is interpolated.

| Token       | Hex       | Used for                                          |
| ----------- | --------- | ------------------------------------------------- |
| `brand-300` | `#D59EFA` | Light accent on dark panels, logo dot, highlights |
| `brand-600` | `#780AC2` | Primary buttons, focus rings, active controls     |
| `brand-900` | `#3C0561` | Deep panels, display headings, sidebar active row |

`plum-*` is a magenta secondary that bridges the purple into warmer highlights
(badges, quote marks, decorative blur). Surfaces sit on a faintly lilac off-white
(`--color-canvas: #FBF9FD`) and `ink-*` is a cool neutral with a slight violet cast, so
the purple reads as deliberate rather than dropped onto a warm grey.

Contrast: white on `brand-600` is 8.1:1 and `brand-300` on `brand-900` is 7.3:1 — both
comfortably past WCAG AA.

### Breakpoints

Content rails step 1 → 2 → 3 columns at `sm`/`md` → `lg`/`xl` rather than jumping
straight from one column to three, so the 768–1023px tablet range is not half empty.
Every grid item carries `min-w-0` (it is baked into `Card`), because a grid child
defaults to `min-width: auto` and will otherwise push the page sideways on a phone.

---

## Notes on the mock backend

There is no server yet. Accounts, applications, mentor requests and workshop
registrations persist to `localStorage` under the `aruna:` namespace so the whole
product can be demonstrated end to end.

Credentials are digested rather than stored verbatim, but **this is not authentication** —
it exists so the UI can be built against realistic flows. Real identity checks belong on
the server.
