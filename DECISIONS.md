# Design Decisions

## Decision Point 1: Authentication model

We chose a demo-role authentication flow using the `x-skillswap-role` header instead of building a full user sign-in system. The backend resolves a user from the active role and keeps the app easy to test, demo, and validate without external auth providers.

This choice fits a hackathon flow because it removes friction for product demos and reduces setup complexity. It also keeps the frontend and backend consistent, since both already rely on role-based access decisions.

## Decision Point 2: Payment and marketplace flow

We chose a mock payment approach with booking and notification workflows rather than integrating a live payment gateway as the primary path. The app still exposes booking and payment logic through the backend API, while a simulated checkout keeps the experience demoable and stable.

This decision reduces dependency risk during development and makes the product testable in a single environment. It also allows the team to validate marketplace behavior, booking states, and UI transitions without waiting on external payment provider onboarding.

## Decision Point 3: Deployment architecture

We chose a split deployment model: the frontend on Vercel and the backend on Render, with environment-based configuration and a standard API layer between them. This keeps the frontend lightweight and the backend logic centralized, while making CORS and production configuration manageable.

This architecture is appropriate for a full-stack project because it matches the way the app already communicates through `/api` routes. It also improves maintainability, since backend changes can be tested independently while the frontend consumes a stable API contract.

## Standard API status

Yes — we implemented the standard API for this track.

The project exposes a structured backend through Express routes and JSON responses under `/api`, and the frontend consumes those endpoints using a dedicated API client. Because the app is built around a real API contract rather than relying only on browser automation, it is designed to be graded by script/API validation rather than by a browser agent driving the UI alone.
