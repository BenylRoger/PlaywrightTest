import { defineConfig } from '@playwright/test';

const HOST = '127.0.0.1';
const PORT = 5173;
const baseURL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests',
  retries: 1,
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  reporter: [['html'], ['line']],
  webServer: {
    command: 'pnpm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});

