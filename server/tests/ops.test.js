const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const emailService = require('../services/emailService');
const { seedDatabaseIfNeeded } = require('../seeder');
const { runSmokeTest } = require('../scripts/smoke-test');

describe('Track D: Production Deployment & Verification Gates (OPS-01 / OPS-02)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }
    await seedDatabaseIfNeeded();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        const Account = mongoose.models.Account;
        if (Account) {
          await Account.deleteMany({
            email: { $in: ['parent.paas@example.com', 'failure.test@example.com', 'smoke-test@example.com'] }
          });
        }
      } catch (err) {
        // Ignore cleanup errors
      }
      await mongoose.connection.close();
    }
  });

  describe('OPS-01: DigitalOcean App Platform Spec (.do/app.yaml)', () => {
    const appSpecPath = path.join(rootDir, '.do', 'app.yaml');

    it('should exist and parse as valid YAML', () => {
      expect(fs.existsSync(appSpecPath)).toBe(true);
      const content = fs.readFileSync(appSpecPath, 'utf8');
      const parsed = yaml.load(content);
      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe('object');
      expect(parsed.name).toBe('malayalam-prime');
    });

    it('should configure backend web service "api" correctly', () => {
      const content = fs.readFileSync(appSpecPath, 'utf8');
      const parsed = yaml.load(content);

      expect(parsed.services).toBeDefined();
      expect(Array.isArray(parsed.services)).toBe(true);

      const apiService = parsed.services.find((s) => s.name === 'api');
      expect(apiService).toBeDefined();
      expect(apiService.source_dir).toBe('server');
      expect(apiService.run_command).toBe('npm start');
      expect(apiService.http_port).toBe(5000);
      expect(apiService.instance_count).toBe(1);
      expect(apiService.instance_size_slug).toBe('basic-xxs');

      // Routes and health check
      expect(apiService.routes).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: '/api' })])
      );
      expect(apiService.health_check).toEqual(
        expect.objectContaining({
          http_path: '/api/health',
          initial_delay_seconds: 15,
          period_seconds: 10
        })
      );

      // Environment variables
      const envKeys = apiService.envs.map((e) => e.key);
      expect(envKeys).toContain('MONGO_URI');
      expect(envKeys).toContain('JWT_SECRET');
      expect(envKeys).toContain('RESEND_API_KEY');
      expect(envKeys).toContain('RESEND_FROM_EMAIL');
      expect(envKeys).toContain('NODE_ENV');
      expect(envKeys).toContain('CLIENT_URL');

      const secretEnvs = apiService.envs.filter((e) => e.type === 'SECRET').map((e) => e.key);
      expect(secretEnvs).toContain('MONGO_URI');
      expect(secretEnvs).toContain('JWT_SECRET');
      expect(secretEnvs).toContain('RESEND_API_KEY');

      const clientUrlEnv = apiService.envs.find((e) => e.key === 'CLIENT_URL');
      expect(clientUrlEnv.value).toBe('${APP_URL}');
    });

    it('should configure frontend static site "web" correctly with catchall SPA routing', () => {
      const content = fs.readFileSync(appSpecPath, 'utf8');
      const parsed = yaml.load(content);

      expect(parsed.static_sites).toBeDefined();
      expect(Array.isArray(parsed.static_sites)).toBe(true);

      const webSite = parsed.static_sites.find((s) => s.name === 'web');
      expect(webSite).toBeDefined();
      expect(webSite.source_dir).toBe('client');
      expect(webSite.build_command).toBe('npm run build');
      expect(webSite.output_dir).toBe('dist');
      expect(webSite.catchall_document).toBe('index.html');
      expect(webSite.routes).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: '/' })])
      );

      const viteApiEnv = webSite.envs.find((e) => e.key === 'VITE_API_URL');
      expect(viteApiEnv).toBeDefined();
      expect(viteApiEnv.value).toBe('${api.PUBLIC_URL}');
    });

    it('should have cleaned up legacy PM2 and Nginx configs', () => {
      expect(fs.existsSync(path.join(rootDir, 'ecosystem.config.js'))).toBe(false);
      expect(fs.existsSync(path.join(rootDir, 'nginx'))).toBe(false);
    });
  });

  describe('Health Gate', () => {
    it('should respond with 200 OK on GET /api/health for PaaS health checks', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Resend Email Service (server/services/emailService.js)', () => {
    it('should export sendOTP function', () => {
      expect(emailService).toBeDefined();
      expect(typeof emailService.sendOTP).toBe('function');
    });

    it('should simulate delivery in test environment without network calls', async () => {
      const result = await emailService.sendOTP('test@example.com', '123456');
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.simulated).toBe(true);
      expect(result.id).toBe('mock-msg-id');
    });
  });

  describe('Auth Integration with Resend Email Delivery', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should invoke sendOTP and return HTTP 200 upon valid OTP request', async () => {
      const sendOtpSpy = jest.spyOn(emailService, 'sendOTP');

      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ email: 'parent.paas@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('OTP sent to email');
      expect(sendOtpSpy).toHaveBeenCalledWith('parent.paas@example.com', expect.any(String));
    });

    it('should return HTTP 500 when email delivery fails', async () => {
      jest.spyOn(emailService, 'sendOTP').mockResolvedValueOnce({
        success: false,
        error: new Error('Resend rate limit exceeded')
      });

      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ email: 'failure.test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Failed to send verification code. Please try again later.'
      });
    });
  });

  describe('OPS-02: Automated Production Smoke Test Harness (server/scripts/smoke-test.js)', () => {
    const smokeScriptPath = path.join(rootDir, 'server', 'scripts', 'smoke-test.js');

    it('should exist as an executable script', () => {
      expect(fs.existsSync(smokeScriptPath)).toBe(true);
    });

    it('should export runSmokeTest function', () => {
      expect(typeof runSmokeTest).toBe('function');
    });

    it('should pass all smoke gates against an active in-process server', async () => {
      const server = app.listen(0);
      const port = server.address().port;
      const baseUrl = `http://127.0.0.1:${port}`;

      try {
        const result = await runSmokeTest(baseUrl);
        expect(result).toBe(true);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });
  });
});
