# Microservices Frontend

Clean React frontend for the Spring Boot blogging API. This project is intentionally lightweight: it gives the backend portfolio a professional user-facing entry point without shifting the main focus away from backend and platform engineering.

## Tech Stack

- React
- React Router
- Bootstrap and Reactstrap
- Axios
- React Toastify
- Jest and React Testing Library

## Current Scope

- Home page with backend connection summary
- Login form connected to `/api/v1/auth/login`
- Signup form connected to `/api/v1/auth/register`
- Basic about and capabilities pages
- Environment-based backend URL configuration
- Clean Bootstrap layout for portfolio presentation

## Run Locally

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
cp .env.example .env
```

Start the app:

```bash
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

By default it expects the backend at:

```text
http://localhost:9090
```

## Environment Variables

Use `.env.example` as the reference:

```text
REACT_APP_API_BASE_URL=http://localhost:9090
```

For deployed environments, set `REACT_APP_API_BASE_URL` to the live backend URL before building the frontend.

## Quality Checks

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

## Docker Runtime

Build the production image:

```bash
docker build --build-arg REACT_APP_API_BASE_URL=http://localhost:9090 -t blog-frontend .
```

Run the production container:

```bash
docker run --rm -p 3000:80 blog-frontend
```

Or use Docker Compose:

```bash
docker compose up --build
```

For a deployed environment, pass the live backend URL at build time:

```bash
docker build --build-arg REACT_APP_API_BASE_URL=https://api.your-domain.com -t blog-frontend .
```

The container serves the React build through Nginx and supports client-side routing refreshes for pages like `/login` and `/signup`.

## Portfolio Positioning

This frontend supports full-stack role screening while keeping the project backend-led. The backend repository contains the main engineering depth: Spring Boot 3, Spring Security 6, JWT, Docker, Jenkins, tests, Actuator, and the deployment/microservices migration roadmap.
