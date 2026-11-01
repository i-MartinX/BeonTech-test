import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // API tests are browser-independent, so they run once
    { name: 'api', testMatch: /api\.spec\.ts/ },
    { name: 'chromium', testMatch: /ui\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /ui\.spec\.ts/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /ui\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
  ],
});
