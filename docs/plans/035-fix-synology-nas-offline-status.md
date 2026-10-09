# Plan 035: Fix Synology NAS "Server Offline" Connection Issue

## 1. Issue & Diagnosis
**Symptom:** App loads over HTTP (`http://192.168.31.45:8080` or `:3000`), but displays "Server Offline" indicator and fails to load data.

**Root Causes:**
1. **MongoDB Volume Permissions on Synology NAS (Primary Cause):**
   - Host path `./data/db` mounted to MongoDB container often suffers permission denial on Synology DSM 7.2 (`root:root` directory ownership blocking `mongodb` user UID 999).
   - This causes MongoDB to fail initialization or crash-loop.
   - When MongoDB fails, backend API `/api/progress/stats` throws HTTP 500 or fails to connect $\rightarrow$ Frontend sets `isConnected = false` ("Server Offline").

2. **Missing `/api/health` Diagnostic Route:**
   - No lightweight health check endpoint exists to verify Nginx-to-Backend proxy connectivity independent of MongoDB.

---

## 2. Technical Solution

### A. Named Volume for MongoDB (`docker-compose.yml`)
- Replace `./data/db:/data/db` with a managed Docker volume `mongodb_data:/data/db`.
- Docker manages container permissions inside `mongodb_data` automatically on Synology NAS without host file system ACL collisions.

### B. Add Diagnostic Endpoint (`server/routes/api.js`)
- Add `GET /api/health` returning `{ status: 'ok', database: 'connected' }`.

---

## 3. Step-by-Step Resolution Steps for User

1. Pull/Update the project files with updated `docker-compose.yml` and `server/routes/api.js`.
2. In Synology **Container Manager**:
   - Go to **Project** $\rightarrow$ `malayalam-prime`.
   - Click **Action** $\rightarrow$ **Clean** (or **Stop** $\rightarrow$ **Delete**).
   - Click **Build / Start Project** again.
3. Test Backend Health in Browser:
   - Navigate to `http://192.168.31.45:8080/api/health` (or port 3000 if using 3000).
   - Should return `{ "status": "ok", "database": "connected" }`.
4. Reload Frontend:
   - Navigate to `http://192.168.31.45:8080`.
