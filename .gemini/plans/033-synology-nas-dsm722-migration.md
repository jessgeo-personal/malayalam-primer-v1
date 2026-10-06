# Plan 033: Synology NAS DSM 7.2.2 Migration & Zero-Config Deployment

## 1. Executive Summary & Objective
**Objective:** Enable a 100% plug-and-play migration of Malayalam Prime to Synology NAS running DSM 7.2.2 using Container Manager (Docker Compose).
**Key Enhancements for NAS:**
1. **Auto-Seeding Engine:** Update backend `server.js` to automatically seed MongoDB on first boot if the database is empty.
2. **Container Healthchecks:** Add healthcheck to MongoDB in `docker-compose.yml` to prevent race conditions during cold start on NAS.
3. **Production Reverse Proxy:** Validate `nginx.conf` to proxy `/api` requests seamlessly on local tablet network (`http://<NAS_IP>:3000`).
4. **DSM 7.2.2 Step-by-Step Deployment Documentation:** Comprehensive guide for Synology Container Manager.

---

## 2. Technical Architecture & File Changes

### A. Backend (`server/server.js`)
- Add an automatic seed check on MongoDB connection:
  - Check `await Word.countDocuments()`.
  - If count is `0`, run internal seeder loading `seed-100.json`, `seed-200.json`, `seed-300.json`.
  - Log `✅ Database initialized with core vocabulary`.

### B. Docker Compose (`docker-compose.yml`)
- Add MongoDB healthcheck (`mongo --eval "db.adminCommand('ping')"`).
- Update backend dependency to `condition: service_healthy` so backend waits for MongoDB before running auto-seeding.

### C. Client Production Build (`client/nginx.conf` & `client/Dockerfile`)
- Confirm Vite multi-stage build + Nginx static serving on port 80 (mapped to port 3000).
- Confirm `/api` proxying to `http://backend:5000`.

### D. Versioning & Changelog
- Update `client/src/config/version.js` to `2026.07.21.001`.
- Log changes in `.gemini/log/CHANGELOG.md`.

---

## 3. Synology NAS DSM 7.2.2 Deployment Workflow

1. **Prerequisites on Synology NAS:**
   - Install **Container Manager** from Synology Package Center.
   - Create shared folder `/docker/malayalam-prime` via DSM File Station.

2. **File Deployment:**
   - Copy project repository files to `/docker/malayalam-prime`.
   - Copy `.env.nas.example` to `.env` in `/docker/malayalam-prime/`.
   - Insert `GEMINI_API_KEY=your_key` in `.env`.

3. **Container Manager Project Creation:**
   - Open **Container Manager** $\rightarrow$ **Project** $\rightarrow$ **Create**.
   - Set Project Name: `malayalam-prime`.
   - Set Path: `/docker/malayalam-prime`.
   - Source: Select `docker-compose.yml`.
   - Click **Next** $\rightarrow$ **Done** to build and launch containers.

4. **Android Tablet Verification:**
   - Find NAS IP address (e.g. `192.168.1.100`).
   - Open Chrome on tablet $\rightarrow$ Navigate to `http://192.168.1.100:3000`.
   - Tap Chrome menu $\rightarrow$ **Add to Home Screen** to run as standalone PWA.

---

## 4. Testing & Quality Assurance Strategy

### Unit & Integration Testing
- **Backend Tests:** Verify `npm test` in `/server` passes.
- **Frontend Tests:** Verify `npm test -- --run` in `/client` passes.
- **Auto-Seeder Test:** Add unit test in `server/tests/seeder.test.js` to verify empty DB trigger logic.

### Architectural & Security Audit
- **"No Cloud Bill":** 100% self-hosted on NAS.
- **Local Network Safety:** API requests use relative paths (`/api`) handled by Nginx.
