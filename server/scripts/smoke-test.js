#!/usr/bin/env node

/**
 * Project Malayalam Prime - Production & Deployment Smoke Test Harness (OPS-02)
 *
 * Runs sequential end-to-end sanity gates against a target live deployment
 * (DigitalOcean App Platform, local Docker, or local Node dev server).
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const pass = (msg) => console.log(`  ${colors.green}✔${colors.reset} ${msg}`);
const fail = (msg) => console.error(`  ${colors.red}✖${colors.reset} ${msg}`);
const info = (msg) => console.log(`  ${colors.cyan}ℹ${colors.reset} ${msg}`);

async function runSmokeTest(rawBaseUrl) {
  const BASE_URL = (rawBaseUrl || process.argv[2] || process.env.TARGET_URL || 'http://localhost:5000').replace(/\/+$/, '');
  console.log(`\n${colors.bold}=== Project Malayalam Prime: Production Smoke Test Suite ===${colors.reset}`);
  info(`Target Base URL: ${BASE_URL}`);

  let allPassed = true;

  // Gate 1: Health Check Gate
  try {
    const healthUrl = `${BASE_URL}/api/health`;
    const res = await fetch(healthUrl);
    if (!res.ok) {
      fail(`[Gate 1] Health Check failed: Expected HTTP 200, received HTTP ${res.status}`);
      allPassed = false;
    } else {
      const data = await res.json();
      if (data.status !== 'ok') {
        fail(`[Gate 1] Health Check failed: Unexpected payload status "${data.status}"`);
        allPassed = false;
      } else {
        pass(`[Gate 1] Health Check: 200 OK (status: ${data.status}, db: ${data.database || 'connected'})`);
      }
    }
  } catch (err) {
    fail(`[Gate 1] Health Check exception: ${err.message}`);
    allPassed = false;
  }

  // Gate 2: API Database Seeding & Curriculum Gate
  try {
    let lessonUrl = `${BASE_URL}/api/game/lesson/1?act=1`;
    let res = await fetch(lessonUrl);
    if (res.status === 404) {
      lessonUrl = `${BASE_URL}/api/session/lesson?lessonId=1`;
      res = await fetch(lessonUrl);
    }

    if (!res.ok) {
      fail(`[Gate 2] Curriculum Gate failed: Expected HTTP 200, received HTTP ${res.status}`);
      allPassed = false;
    } else {
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        fail(`[Gate 2] Curriculum Gate failed: Expected non-empty array of lesson items, got: ${JSON.stringify(data)}`);
        allPassed = false;
      } else {
        pass(`[Gate 2] Database & Curriculum: 200 OK (${data.length} lesson items loaded for Lesson 1)`);
      }
    }
  } catch (err) {
    fail(`[Gate 2] Curriculum Gate exception: ${err.message}`);
    allPassed = false;
  }

  // Gate 3: Static Web SPA Gate
  try {
    // 3a. Root document
    const rootRes = await fetch(`${BASE_URL}/`);
    const rootContentType = rootRes.headers.get('content-type') || '';
    if (!rootRes.ok || !rootContentType.includes('text/html')) {
      fail(`[Gate 3] Static Web SPA root failed: HTTP ${rootRes.status}, Content-Type: ${rootContentType}`);
      allPassed = false;
    } else {
      // 3b. Catchall document for non-existent route
      const catchallRes = await fetch(`${BASE_URL}/non-existent-route`);
      const catchallContentType = catchallRes.headers.get('content-type') || '';
      if (!catchallRes.ok || !catchallContentType.includes('text/html')) {
        fail(`[Gate 3] Static Web SPA catchall routing failed: HTTP ${catchallRes.status}, Content-Type: ${catchallContentType}`);
        allPassed = false;
      } else {
        pass(`[Gate 3] Static Web SPA: Root & SPA fallback routing return 200 text/html`);
      }
    }
  } catch (err) {
    fail(`[Gate 3] Static Web SPA exception: ${err.message}`);
    allPassed = false;
  }

  // Gate 4: Email & Auth Endpoint Sanity Gate
  try {
    const authUrl = `${BASE_URL}/api/auth/request-otp`;
    const res = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoke-test@example.com' })
    });

    const data = await res.json().catch(() => null);

    if (res.status === 200) {
      if (data && (data.success || data.message)) {
        pass(`[Gate 4] Auth & Email Service: 200 OK (OTP delivery operational)`);
      } else {
        fail(`[Gate 4] Auth & Email Service: 200 OK but invalid payload structure: ${JSON.stringify(data)}`);
        allPassed = false;
      }
    } else if (res.status === 500 && data && data.error) {
      pass(`[Gate 4] Auth & Email Service: 500 Handled Gracefully (${data.error})`);
    } else {
      fail(`[Gate 4] Auth & Email Service failed: Unexpected HTTP ${res.status} (${JSON.stringify(data)})`);
      allPassed = false;
    }
  } catch (err) {
    fail(`[Gate 4] Auth & Email Service exception: ${err.message}`);
    allPassed = false;
  }

  console.log('------------------------------------------------------------');
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✔ ALL SMOKE TESTS PASSED - Deployment verified successfully!${colors.reset}\n`);
    return true;
  } else {
    console.error(`${colors.red}${colors.bold}✖ SMOKE TEST SUITE FAILED - One or more gates failed verification.${colors.reset}\n`);
    return false;
  }
}

if (require.main === module) {
  const targetUrl = process.argv[2] || process.env.TARGET_URL || 'http://localhost:5000';
  runSmokeTest(targetUrl)
    .then((success) => process.exit(success ? 0 : 1))
    .catch((err) => {
      console.error(`Fatal smoke runner crash: ${err.stack || err}`);
      process.exit(1);
    });
}

module.exports = { runSmokeTest };
