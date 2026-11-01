import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // Baselines are per-OS and per-browser: font rendering differs between Windows and Linux runners.
  snapshotPathTemplate:
    '{testDir}/../__screenshots__/{platform}/{projectName}/{testFileName}/{arg}{ext}',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
  ],
  use: {
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // API tests are browser-independent, so they run once
    { name: 'api', testMatch: /api\.spec\.ts/ },
    { name: 'chromium', testMatch: /(ui|visual)\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /(ui|visual)\.spec\.ts/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /(ui|visual)\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
  ],
});
