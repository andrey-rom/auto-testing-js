import { defineConfig, devices } from '@playwright/test';

const VIEWPORT_WIDTH = process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 1920;
const VIEWPORT_HEIGHT = process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1080;
const WORKERS = process.env.workers ? parseInt(process.env.workers) : undefined;
const RUN_THIS = process.env.runThis;

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  grep: RUN_THIS ? new RegExp(RUN_THIS, 'i') : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: WORKERS || (process.env.CI ? 1 : undefined),
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        actionTimeout: 60000,
        navigationTimeout: 90000,
      },
    },
  ],
});
