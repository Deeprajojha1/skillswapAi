# SkillSwap Backend

Express, MongoDB, Redis, BullMQ, and Socket.IO backend for SkillSwap.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with Node.
- `npm test` runs Vitest API tests.
- `npm run seed` loads sample users, gigs, and bookings.

## Base Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/gigs`
- `POST /api/gigs`
- `GET /api/bookings`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/accept`
- `PATCH /api/bookings/:id/decline`
- `PATCH /api/bookings/:id/cancel`
- `PATCH /api/bookings/:id/complete`
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`

## Credentials

Put real credentials in `.env` only:

- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`
- `PAYMENT_PROVIDER=mock` for local testing or `PAYMENT_PROVIDER=razorpay`
- `PAYMENT_KEY_ID`, `PAYMENT_KEY_SECRET`, `PAYMENT_WEBHOOK_SECRET`

Resend notification emails default to `ojhadeepraj71@gmail.com` when a user email is not available.

## Payment Flow

Bookings start as `pending`. A creator accepts a booking, the booking becomes `accepted`, and the gig becomes `booked`. The client then calls `POST /api/payments/create-order`; amount is calculated from the booking price snapshot, never from frontend input. `POST /api/payments/verify` verifies the provider signature before marking payment as paid.

For local tests use:

```json
{
  "signature": "mock_valid_signature"
}
```
