# Plan 034: Fix Synology NAS SSL / Invalid Response Error (`ERR_SSL_PROTOCOL_ERROR`)

## 1. Root Cause Analysis
**Error:** `This site can’t provide a secure connection - 192.168.31.45 sent an invalid response (ERR_SSL_PROTOCOL_ERROR)`

### Why this happens:
1. **HTTP vs. HTTPS Mismatch:**
   - The Nginx container inside `malayalam_web` serves plain **HTTP** on port 3000 (`3000:80`).
   - Modern browsers (Chrome, Edge, Safari) default to **HTTPS** when entering IP addresses (`https://192.168.31.45:3000`), or Synology DSM has "Automatically redirect HTTP connections to HTTPS" enabled globally.
   - When an HTTPS SSL handshake is sent to an HTTP port, Nginx returns a raw HTTP response, causing Chrome to display `ERR_SSL_PROTOCOL_ERROR`.

2. **Synology DSM Port 3000 Conflict (Potential):**
   - Port 3000 can sometimes be reserved by DSM web services or third-party NAS packages.

---

## 2. Solutions

### Solution 1: Explicit HTTP URL in Browser (Immediate Fix)
- Open browser and explicitly type **`http://`** before the IP:
  ```
  http://192.168.31.45:3000
  ```
- Make sure Chrome does not auto-complete to `https://`.

### Solution 2: Change Port Mapping in `docker-compose.yml` (Avoid Port 3000 Conflicts)
- Update `docker-compose.yml` port mapping from `3000:80` to `8080:80` or `3080:80`.
- Example:
  ```yaml
    frontend:
      ports:
        - "8080:80"
  ```
- Access via: `http://192.168.31.45:8080`

### Solution 3: Synology DSM Native Reverse Proxy for HTTPS (Recommended for PWA)
If you want HTTPS so Android PWA features work without security warnings:
1. Open DSM $\rightarrow$ **Control Panel** $\rightarrow$ **Login Portal** $\rightarrow$ **Advanced** tab.
2. Click **Reverse Proxy** $\rightarrow$ **Create**.
3. **Source:**
   - Protocol: `HTTPS`
   - Hostname: `*` (or your NAS IP `192.168.31.45`)
   - Port: `3001` (or any free HTTPS port)
4. **Destination:**
   - Protocol: `HTTP`
   - Hostname: `localhost`
   - Port: `3000`
5. Save and access `https://192.168.31.45:3001` on your tablet.

---

## 3. Implementation & Verification Plan
1. Update `docker-compose.yml` to use `8080:80` to avoid potential Synology system port collisions on port 3000.
2. Update `.env.nas.example` and documentation accordingly.
3. Update version in `client/src/config/version.js` to `2026.07.21.002`.
4. Log changes in `.gemini/log/CHANGELOG.md`.
