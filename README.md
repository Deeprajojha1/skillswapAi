# SkillSwap AI

## Hackathon ID
- Hackathon ID:AZIS-PYRJ8S

SkillSwap AI is a full-stack skill marketplace where clients can discover creators, book services, manage payments, and receive notifications. The platform supports a demo-role flow for quick testing without a traditional login form.

## Project Track

- Full-stack web application
- Skill marketplace + gig booking flow
- Creator dashboard + client dashboard
- Real-time notifications and socket updates
- Payment simulation and booking management

## Tech Stack

### Frontend
- React
- Vite
- React Router
- TanStack Query
- Redux Toolkit
- Socket.IO Client
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Redis
- Socket.IO
- BullMQ
- JWT
- Cloudinary
- Resend
- Razorpay-ready payment integration

### Dev Tools
- Vitest
- Supertest
- Nodemon
- Docker Compose

## Project Structure

```bash
skillswapAi/
├── skillswap-backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── skillswap-frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── render.yaml
├── README.md
└── .gitignore
```

## Local Setup

### 1) Clone the repo

```bash
git clone https://github.com/ErSohrab/skillswapAi.git
cd skillswapAi
```

### 2) Backend setup

```bash
cd skillswap-backend
npm install
```

Create a `.env` file in the backend folder with variables like:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/skillswap
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_COOKIE_NAME=skillswap_token
COOKIE_SECURE=false
```

Then run:

```bash
npm run dev
```

### 3) Frontend setup

```bash
cd ../skillswap-frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

Open the local frontend URL shown in the terminal (usually Vite default: http://localhost:5173).

## Run with Docker (optional)

From the backend folder:

```bash
docker-compose up --build
```

## Test Credentials

The app supports a demo-role mode. The backend resolves a user based on the `x-skillswap-role` header.

### Demo users

| Role | Email | Password |
| --- | --- | --- |
| Client | demo.client@skillswap.local | demo-password |
| Creator | demo.creator@skillswap.local | demo-password |
| Admin | demo.admin@skillswap.local | demo-password |

### Seed users

These are also available in the seeded database for testing:

| Role | Email | Password |
| --- | --- | --- |
| Creator | maya@skillswap.test | password123 |
| Creator | arjun@skillswap.test | password123 |
| Client | client@skillswap.test | password123 |

You can seed the database with:

```bash
cd skillswap-backend
npm run seed
```

## Tests

Run backend tests:

```bash
cd skillswap-backend
npm test
```

These tests cover the demo-role auth flow and validation behavior.

## Deployment

### Render (Backend)

A root Render blueprint is included at:

```bash
render.yaml
```

Use Render Blueprint deployment and set the required environment variables before starting the service.

### Vercel (Frontend)

Set the frontend environment variables in Vercel:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-render-backend-url.onrender.com
```

## Notes

- The app is built to support demo authentication during development and testing.
- CORS must allow your deployed frontend origin in production.
- If using Render + Vercel, make sure `CLIENT_URL` on the backend matches the deployed Vercel domain exactly.

## License

This project is for learning and demo purposes.
