# Plan 036: Fix Synology NAS Port Allocation Error (`port is already allocated`)

## 1. Issue Analysis
**Error:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

### Why this happens:
- On Synology NAS, port `8080` is often bound by third-party packages, Synology Web Station, or another Docker container.
- Hardcoding host port `8080` in `docker-compose.yml` caused a port conflict on startup.

---

## 2. Solution
1. **Configurable Port via Environment Variable:**
   - Change `docker-compose.yml` frontend port mapping from `8080:80` to `"${WEB_PORT:-3080}:80"`.
   - Default host port is now **`3080`** (avoiding standard `8080` conflicts), and customizable in `.env` via `WEB_PORT`.

2. **Documentation & Environment Template Update:**
   - Add `WEB_PORT=3080` to `.env.nas.example`.

3. **Version & Changelog:**
   - Update `client/src/config/version.js` to `2026.07.21.004`.
   - Log entry in `.gemini/log/CHANGELOG.md`.
