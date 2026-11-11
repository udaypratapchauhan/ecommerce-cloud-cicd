<div align="center">

# 🛒 Nexus Bazaar - Cloud-Native E-Commerce Platform with Automated CI/CD

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/udaypratapchauhan/ecommerce-cloud-cicd/actions)
[![Vercel Live](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-ecommerce-henna-ten.vercel.app)
[![Render Deployed](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://ecommerce-backend-5ts8.onrender.com/api/products)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

A production-ready full-stack e-commerce marketplace featuring a modern responsive React storefront, a RESTful Node.js/Express API, managed PostgreSQL persistence with automated schema migration & seeding, multi-stage Docker containerization, and a fully automated GitHub Actions CI/CD pipeline.

</div>

---

## 🌐 Live Demo

| Service | Platform | Live Endpoint |
| :--- | :--- | :--- |
| **Frontend Storefront** | Vercel Edge Network | [https://frontend-ecommerce-henna-ten.vercel.app](https://frontend-ecommerce-henna-ten.vercel.app) |
| **Backend REST API** | Render Web Service | [https://ecommerce-backend-5ts8.onrender.com/api/products](https://ecommerce-backend-5ts8.onrender.com/api/products) |
| **Health Check API** | Render Web Service | [https://ecommerce-backend-5ts8.onrender.com/health](https://ecommerce-backend-5ts8.onrender.com/health) |

---

## 🏗️ System Architecture & Tech Stack

| Layer | Technologies Used | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Responsive CSS Grid, Lucide Icons | High-speed SPA storefront with real-time search, category filtering, Indian Rupee (`₹`) formatting, and cart feedback. |
| **Backend** | Node.js 20, Express.js, RESTful APIs | Stateless API service exposing `/health` and `/api/products` routes with CORS enabled for cross-origin access. |
| **Database** | PostgreSQL (Render Managed DB) | Relational persistence with automated table migration (`CREATE TABLE IF NOT EXISTS` / `ALTER TABLE`) and 40 seeded items. |
| **Cloud & Hosting** | Vercel, Render | Vercel Edge CDN serving static Vite assets; Render hosting the Express backend and Managed PostgreSQL database. |
| **CI/CD & DevOps** | GitHub Actions, Docker, Nginx, Render Webhooks | Multi-stage Dockerfiles, Nginx reverse proxy for containerized local runs, and automated CI validation + CD deployment hooks. |

---

## 🔄 CI/CD Pipeline Workflow

Every push to `main` (or manual `workflow_dispatch`) triggers an automated validation and deployment pipeline ensuring zero broken builds reach production:

```mermaid
flowchart LR
    A["Developer Git Push (main)"] --> B["GitHub Actions Trigger"]
    B --> C["Job 1: ci-validation (Node 20 & Vite Build)"]
    C -->|Tests & Build Pass| D["Job 2: cd-trigger-backend (Render Deploy Webhook)"]
    B -->|Auto Sync| E["Vercel Zero-Config Continuous Deployment"]
    D --> F["Render Live Backend Updated"]
    E --> G["Vercel Live Frontend Updated"]
```

### Pipeline Stages:
1. **`ci-validation` (Runs on `ubuntu-latest`)**:
   - Checks out repository (`actions/checkout@v4`) and provisions Node.js 20 (`actions/setup-node@v4`).
   - Installs backend dependencies, verifies syntax (`node --check`) across controllers, routes, and database configs, and runs backend tests (`npm test --if-present`).
   - Installs frontend dependencies and executes `npm run build` via Vite to guarantee a clean, error-free production bundle.
2. **`cd-trigger-backend` (Runs only if `ci-validation` succeeds on `main`)**:
   - Dispatches a secure `POST` request to `${{ secrets.RENDER_DEPLOY_HOOK }}` via `curl` to redeploy the backend service on Render.
3. **Vercel Continuous Deployment**:
   - Connected directly to the GitHub repository (`frontend` root directory) for instant zero-config deployments on every push to `main`.

---

## ✨ Key Features

- **Automated CI/CD Guardrails**: Prevents syntax regressions or failed frontend builds from deploying to production through automated GitHub Actions gates.
- **40-Item Verified E-Commerce Catalog**: Automatically seeds 40 diverse, high-demand products across 4 categories (**Electronics**, **Footwear**, **Fashion**, **Fitness** — 10 items per category) complete with verified Unsplash product photography, ratings, review counts, and stock levels.
- **Localized Indian Marketplace UI**: Styled in a clean Flipkart/Amazon/Myntra hybrid layout with responsive CSS Grid, strikethrough original prices, dynamically calculated `% OFF` badges, and localized `₹` (`en-IN`) formatting.
- **Cloud-Ready PostgreSQL Pooling**: Configures `pg.Pool` with dynamic `DATABASE_URL` support and conditional SSL (`{ rejectUnauthorized: false }` for Render cloud PostgreSQL) alongside automatic schema initialization on server startup.
- **Containerization Ready**: Multi-stage Alpine Docker builds for both Backend (`node:20-alpine`) and Frontend (`nginx:alpine`) orchestrated via `docker-compose.yml` with Nginx reverse proxy routing `/api/` requests seamlessly.

---

## 🛠️ Local Development Setup Guide

### Prerequisites
- **Node.js** `v20+` and `npm`
- **PostgreSQL** `15+` (or **Docker Desktop** with Docker Compose)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/udaypratapchauhan/ecommerce-cloud-cicd.git
cd ecommerce-cloud-cicd
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (or inside `backend/.env`) using `.env.example` as a reference:
```env
# Local PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# Docker Compose Database Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_HOST=postgres
PORT=5000
```

For local Vite development targeting a custom API URL (optional, defaults to local proxy `/api` -> `http://localhost:5000`), create `frontend/.env`:
```env
VITE_API_URL=
```

### 3. Option A — Run Locally with Node.js

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```
*Server starts on `http://localhost:5000`, creates the `products` table automatically, and seeds 40 items.*

**Start the Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend starts on `http://localhost:3000` with Vite proxy forwarding `/api` requests to `http://localhost:5000`.*

### 4. Option B — Run Full Stack with Docker Compose
Launch PostgreSQL, Backend, and Frontend (Nginx) together in isolated containers:
```bash
docker-compose up --build
```
- **Storefront**: Open [http://localhost](http://localhost) (port 80)
- **API via Reverse Proxy**: [http://localhost/api/products](http://localhost/api/products)

---

## 📂 Repository Directory Structure

```text
ecommerce-cloud-cicd/
├── .env.example                        # Environment configuration template
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions CI validation & Render CD hook
├── backend/
│   ├── .dockerignore                   # Excludes node_modules, .env, and logs from image
│   ├── Dockerfile                      # Multi-stage Node 20 Alpine production image
│   ├── package.json                    # Express, pg, cors, dotenv scripts & dependencies
│   └── src/
│       ├── config/
│       │   └── db.js                   # pg Pool with SSL & auto-migration/40-item seeding
│       ├── controllers/
│       │   └── productController.js    # GET & POST /api/products SQL handlers
│       ├── models/
│       │   └── schema.sql              # PostgreSQL products table DDL reference
│       ├── routes/
│       │   ├── health.js               # GET /health service status endpoint
│       │   └── productRoutes.js        # /api/products Express router
│       └── server.js                   # Express app initialization & route mounting
├── docker-compose.yml                  # Local multi-container orchestration (DB, API, Web)
└── frontend/
    ├── Dockerfile                      # Multi-stage Vite build + Nginx Alpine server
    ├── index.html                      # Vite root HTML entry shell
    ├── nginx.conf                      # Nginx SPA fallback & /api/ reverse proxy config
    ├── package.json                    # React 18 & Vite build scripts
    ├── vite.config.js                  # Vite React plugin & local /api dev proxy
    └── src/
        ├── App.jsx                     # Marketplace UI, search, category filters & INR formatting
        ├── index.css                   # Responsive CSS Grid & modern marketplace styling
        └── main.jsx                    # React DOM entry point
```

