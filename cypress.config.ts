import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    retries: { runMode: process.env.CI ? 1 : 0, openMode: 0 },
  },
  screenshotsFolder: 'reports/cypress-screenshots',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'reports/cypress-json',
    overwrite: true,
    reportFilename: '[name]',
    html: false,
    json: true,
  },
});
