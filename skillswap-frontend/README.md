# SkillSwap Frontend

A production-oriented React frontend for **SkillSwap — A Creator Gig Marketplace**, built to talk directly to the
existing `skillswap-backend` REST + Socket.IO API. This is not a static UI mockup — every screen is wired to real
backend endpoints, with proper loading/error/empty states, optimistic-friendly cache invalidation, and role-based
routing.

## Stack

- **React 19 + Vite 7** — app shell and build tooling
- **React Router 7** — routing, protected/role-gated routes
- **Redux Toolkit** — global client/UI state only (`authSlice`, `uiSlice`, `notificationSlice`)
- **TanStack Query** — all server state (gigs, bookings, notifications, users, payments)
- **Axios** — HTTP client, `withCredentials: true` (backend auth is an HTTP-only cookie — the frontend never reads
  or stores a JWT itself)
- **Socket.IO client** — realtime booking/payment/notification events
- **React Hook Form + Zod** — form state and client-side validation (mirrors backend Zod schemas)
- **Tailwind CSS v4 + Framer Motion + lucide-react** — styling, motion, icons
- **Sonner** — toast notifications

## Getting started

```bash
npm install
cp .env.example .env   # then point VITE_API_URL / VITE_SOCKET_URL at your backend
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

The backend (`skillswap-backend`) must be running separately — see its own README. By default this app expects it at
`http://localhost:5000`.

## Environment variables

| Variable                | Purpose                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| `VITE_API_URL`           | Base REST URL, including `/api` (e.g. `http://localhost:5000/api`)   |
| `VITE_SOCKET_URL`        | Socket.IO server URL, no `/api` suffix                                |
| `VITE_PAYMENT_PROVIDER`  | `mock` (default) or `razorpay` — gates which payment UI renders       |

## Project structure

```
src/
  app/            App shell, Redux store, providers (Query/Redux/Socket/Auth)
  components/     Reusable UI (ui/, layout/, marketplace/, gigs/, bookings/, payments/, notifications/, dashboard/)
  features/       Per-domain API calls + React Query hooks + Zod schemas (auth, users, gigs, bookings, payments, notifications)
  pages/          Route-level screens (public/, marketplace/, client/, creator/, shared/, profile/)
  routes/         AppRoutes, ProtectedRoute, RoleRoute
  services/       apiClient (Axios), errorHandler, socket, toast
  hooks/          useDebounce, useMediaQuery, useSocket
  lib/            constants (routes, enums, query keys), queryClient
  utils/          formatCurrency, formatDate, getErrorMessage, helpers
```

## Known backend-driven adaptations

The frontend was built by reading the actual backend source (routes, Zod validators, Mongoose models, socket
events) rather than assuming an ideal API. A few real gaps in the current backend shaped specific UI decisions —
worth knowing if the backend evolves:

- **No "my gigs" / creator-filtered gig endpoint.** `GET /gigs` always filters `status: active` and has no
  `creator` query param. `MyGigs` therefore fetches the public active-gig feed and filters it client-side by the
  logged-in creator's id — a creator's paused/inactive/booked gigs won't appear there until the backend adds a
  dedicated endpoint.
- **No gig status toggle.** `updateGigSchema` doesn't include `status`, so pause/activate isn't achievable via the
  API. The UI shows status as a read-only badge instead of a fake control.
- **No image re-upload on edit.** `PATCH /gigs/:id` has no multer/Cloudinary middleware — only `POST /gigs` does.
  `EditGig` shows the existing image read-only rather than offering a broken upload control.
- **No public creator-profile endpoint.** Only `GET /users/me` exists. `/creators/:userId` derives a creator's
  public info and gig list from the already-fetched active-gig feed's populated `gig.creator` field, so creators
  with zero active gigs currently have no visible profile.
- **No payment-status endpoint.** `booking.paymentStatus` (on the booking document itself) is the source of truth
  for payment state; every payment mutation invalidates the booking query rather than polling a separate payment
  endpoint.
- **Sorting is client-side.** `GET /gigs` only supports `search`/`category`; the sort dropdown (Newest / Price)
  sorts the already-fetched, server-filtered result set via React Query's `select`.
- **Socket auth is `handshake.auth.userId`, not the cookie.** The client only connects once `GET /users/me` has
  resolved, so the id still comes from an authenticated response.

None of these are frontend bugs — they're the frontend being honest about what the current API can and can't do.
