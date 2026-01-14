# Kanban Task Manager Application

A full-stack task management application with React frontend and Express backend.

## Architecture

- **Frontend**: React + Vite (hosted on GitHub Pages)
- **Backend**: Express.js + MongoDB (hosted on Render.com)

## Deployment

### Frontend (GitHub Pages)

The frontend is built with Vite and configured to be deployed at `https://rafsan0606.github.io/kanban-task-manager/frontend/`

**Build & Deploy:**
```bash
cd frontend
npm install
npm run build:prod
```

The build output will be generated in `frontend/dist/`

**Environment Variables:**
- `.env` - Local development (uses localhost:3000)
- `.env.production` - Production build (uses Render API)

### Backend (Render.com)

The backend is containerized with Docker and deployed on Render.

**Render Configuration:**
- **Name**: rafsan-kanban-api
- **Language**: Docker
- **Branch**: main
- **Root Directory**: kanban-task-manager/backend
- **Dockerfile Path**: ./Dockerfile
- **Health Check Path**: /health
- **Environment Variables**:
  - `NODE_ENV=production`
  - `PORT=10000`
  - `MONGO_DB_URI_PROD=<your_mongodb_uri>`

**API URL**: https://rafsan-kanban-api.onrender.com

## Local Development

### Start Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:3000`

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Running Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Technologies

- **Frontend**: React 19, Vite, Tailwind CSS, dnd-kit, Axios
- **Backend**: Express.js, MongoDB, Mongoose, OpenTelemetry
- **DevTools**: Biome (linting), Vitest (testing)