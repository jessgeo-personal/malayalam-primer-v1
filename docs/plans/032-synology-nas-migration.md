# Plan: Synology NAS Migration & Deployment

## 1. Diagnosis & Objective
**Objective:** Migrate the "Malayalam Prime" application to a Synology NAS environment using Docker (Container Manager) to allow local network access via Android tablets.
**Gap:** The current production Docker setup lacks an Nginx configuration to proxy `/api` requests to the backend. The volume paths for MongoDB need to be adjusted for Synology's filesystem.

## 2. Implementation Steps

### A. Infrastructure Prep (Local Machine)
1. **Create `client/nginx.conf`:** Define the reverse proxy to route `/api` to the `backend` service.
2. **Update `client/Dockerfile`:** Copy the custom `nginx.conf` into the image.
3. **Update `docker-compose.yml`:**
   - Standardize volume paths for Synology (`./data/db` is acceptable if the folder is mapped in Container Manager).
   - Ensure `GEMINI_API_KEY` is passed via an `.env` file that is NOT committed.

### B. Migration Payload Preparation
1. **Source Bundle:** Prepare a clean copy of the project:
   - Include: `client/`, `server/`, `docker-compose.yml`, `GEMINI.md`.
   - Exclude: `node_modules/`, `.git/`, `.env`, `client/dist/`.
2. **Environment File:** Create a production `.env` template.

### C. Synology Deployment Procedure (Manual Steps for User)
1. **NAS Setup:**
   - Install "Container Manager" from Synology Package Center.
   - Create a shared folder: `/volume1/docker/malayalam-prime`.
2. **File Transfer:** Upload the source bundle to the shared folder.
3. **Configuration:**
   - Create the `.env` file in the root folder with the valid `GEMINI_API_KEY`.
4. **Execution:**
   - Open Container Manager -> Project -> Create.
   - Point to the uploaded folder.
   - Run the project.

### D. Verification (Tablet Access)
1. **Network Sync:** Identify the NAS Local IP (e.g., `192.168.1.100`).
2. **Access:** Open Chrome on the tablet and go to `http://192.168.1.100:3000`.
3. **PWA Install:** Tap "Add to Home Screen" to install the PWA.

---

## 3. Testing Strategy
- **Proxy Test:** Verify that the frontend can fetch data from `/api/progress/stats` on the NAS.
- **Persistence Test:** Restart containers and verify that user progress is retained in MongoDB.
- **Tablet UX:** Confirm that touch events and drag-and-drop work correctly over the local Wi-Fi.

---
**[APPROVAL REQUIRED]: Please approve this plan to finalize the Docker configuration and prepare the migration bundle.**
