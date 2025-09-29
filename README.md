# SeaLens - AI-driven Fisheries Management (Prototype)

A mobile-first Progressive Web App (PWA) demonstrating:
- Fish Hotspot Mapping (Leaflet)
- Cross-Domain Market & Timing Analytics (Chart.js)

Stack: React (Vite) + Node/Express + MongoDB + Socket.IO + Python (analytics) + Docker.

## Quickstart

1) Prereqs
- Node 20+, Python 3.9+, Docker (optional)
- MongoDB local OR use `docker-compose` which starts Mongo

2) Backend
- Open a terminal:
  - cd server
  - cp .env.example .env (optional; defaults are sane)
  - npm run dev

3) Seed demo data
- From repo root:
  - npm run seed

4) Frontend
- In another terminal:
  - cd client
  - npm run dev
- App runs at http://localhost:5173 (PWA enabled)

5) Docker (all-in-one)
- docker-compose up --build
- App at http://localhost:8080, API at http://localhost:4000

## Key Features
- Interactive Leaflet map with color-coded density markers, filters, popups
- Market timing dashboard with price trends, festival alerts, and top profit recs
- REST APIs for hotspots, market data, cultural events, alerts, and profit recommendations
- WebSocket live updates (mocked) for hotspots, prices, and alerts
- PWA: offline caching for API/images, manifest, installable

## Environment
- Server: `server/.env` (MONGODB_URI, PORT, PYTHON_BIN)
- Client: `VITE_API_BASE` (optional; defaults to `/api` with Vite proxy in dev)

## Scripts
- Root: `npm run dev`, `npm run seed`, `npm run build`, `npm run preview`
- Server: `npm run dev`, `npm run seed`
- Client: `npm run dev`, `npm run build`, `npm run preview`

# Hackathon Prototype

A minimal prototype scaffolded for rapid iteration during a hackathon. This repository starts as a static site so it runs anywhere without extra tooling.

## Getting Started

- Open `public/index.html` in your browser, or
- Serve the `public` directory with any static file server.

## Project Structure

- `public/` – Static assets and the entry HTML file

## Next Steps

- Add your preferred runtime or framework (Node, Python, .NET, etc.)
- Wire up a simple API or mock data
- Add a build step if needed (bundler, TypeScript, etc.)

## License

Unlicensed (for hackathon prototyping). Add a LICENSE if needed.
