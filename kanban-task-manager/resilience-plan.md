## 1. Failure: [Database crash]

### Detection
How will we know the database is down?
- [x] Health check for backend that depends on DB fails (`/ready`)
- [x] Backend logs show connection errors (`MongooseServerSelectionError`)
- [x] Monitoring alerts from Docker, PM2, or cloud monitoring tools

### Immediate Impact
Which parts of the app are affected?
- [x] All task-related API endpoints fail (CRUD operations)
- [x] Frontend may show empty tasks or error messages

### Mitigation
What can we do to reduce impact?
- [x] Notify users that database is temporarily unavailable
- [x] Docker `restart: always` for DB container ensures automatic restart
- [x] Monitor logs to detect early warning signs

### Recovery
How do we restore service?
- [x] Restart database container (`docker compose restart <database container>`)
- [x] Restore from latest automatic backups if corruption occurs (`mongorestore`)
- [x] Verify DB connectivity in backend logs and API health checks

---

## 2. Failure: [Backend API crash/downtime]

### Detection
How will we know the backend API is down?
- [x] Health check endpoints fail (`/health`)
- [x] Frontend reports API errors or failed requests
- [x] PM2 logs show process exited or error messages

### Immediate Impact
Which parts of the app are affected?
- [x] All API endpoints fail, users cannot fetch or update tasks
- [x] Frontend cannot display dynamic task data

### Mitigation
What can we do to reduce impact?
- [x] Docker `restart: on-failure` ensures backend container tries to come back online after crashing

### Recovery
How do we restore service?
- [x] Restart backend container (`docker compose restart <backend container>`)
- [x] Check PM2 status (`npx pm2 list`) and restart process if needed
- [x] Verify API endpoints via health check
- [x] Investigate logs to identify and fix root cause

---

## 3. Failure: [Frontend crash or unavailability]

### Detection
How will we know the frontend is down?
- [x] Users report blank page or failed UI load
- [x] Docker logs show container stopped unexpectedly

### Immediate Impact
Which parts of the app are affected?
- [x] Users cannot access the app in the browser
- [x] Task viewing and interaction stop completely
- [x] API backend may still be running, but inaccessible

### Mitigation
What can we do to reduce impact?
- [x] Docker `restart: always` ensures frontend container attempts restart

### Recovery
How do we restore service?
- [x] Restart frontend container (`docker compose restart <frontend container>`)
- [x] Check Nginx logs Docker logs
- [x] Rebuild and redeploy frontend if build files are corrupted

---

## 4. Failure: [Docker container crash]

### Detection
How will we know a container crashed?
- [x] `docker ps` shows container is stopped or exited
- [x] PM2 logs show process exited (for backend)

### Immediate Impact
Which parts of the app are affected?
- [x] Backend, frontend, or database may become unavailable
- [x] Dependent services fail for example: frontend cannot fetch tasks

### Mitigation
What can we do to reduce impact?
- [x] Use `restart: always` or `restart: on-failure` in `docker-compose.yml`
- [x] PM2 auto-restart for backend
- [x] Health checks to detect failure early

### Recovery
How do we restore service?
- [x] Restart crashed container (`docker compose restart <container name>`)
- [x] Check logs to identify root cause
- [x] Redepoly or rebuild container if necessary
