import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const basePath = 'playwright';
const outputDir = `${basePath}/playwright-results`;

export default defineConfig({
  testDir: `${basePath}/tests`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: path.join(outputDir, 'html-report') }],
    ['json', { outputFile: path.join(outputDir, 'results.json') }],
  ],
  outputDir: path.join(outputDir, 'test-artifacts'),
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  globalSetup: './playwright/test-setup.ts',
});
