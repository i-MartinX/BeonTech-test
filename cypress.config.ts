import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'cypress';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { VISUAL } from './shared/data';

const MAX_DIFF_RATIO = 0.01;
const screenshotsFolder = 'reports/cypress-screenshots';
// Baselines are per-OS: font rendering differs between Windows and Linux runners.
const baselineDir = path.join('cypress', 'snapshots', process.platform);
const diffDir = path.join('reports', 'cypress-diffs');
const update = ['1', 'true'].includes(process.env.UPDATE_SNAPSHOTS ?? '');

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    viewportWidth: VISUAL.viewport.width,
    viewportHeight: VISUAL.viewport.height,
    retries: { runMode: process.env.CI ? 1 : 0, openMode: 0 },
    setupNodeEvents(on) {
      on('task', {
        compareSnapshot({ name, spec }: { name: string; spec: string }) {
          const actualPath = path.join(screenshotsFolder, spec, `${name}.png`);
          const baselinePath = path.join(baselineDir, `${name}.png`);
          const result = (status: string, diffRatio = 0, message = status) => ({
            status,
            diffRatio,
            message,
          });

          if (update) {
            fs.mkdirSync(baselineDir, { recursive: true });
            const existed = fs.existsSync(baselinePath);
            fs.copyFileSync(actualPath, baselinePath);
            return result(existed ? 'updated' : 'created');
          }
          if (!fs.existsSync(baselinePath)) {
            return result(
              'missing',
              0,
              `No baseline at ${baselinePath}. Run with UPDATE_SNAPSHOTS=1 to create it.`,
            );
          }

          const actual = PNG.sync.read(fs.readFileSync(actualPath));
          const expected = PNG.sync.read(fs.readFileSync(baselinePath));
          if (actual.width !== expected.width || actual.height !== expected.height) {
            return result(
              'size-mismatch',
              1,
              `Size ${actual.width}x${actual.height} differs from baseline ${expected.width}x${expected.height}`,
            );
          }

          const diff = new PNG({ width: actual.width, height: actual.height });
          const diffPixels = pixelmatch(
            actual.data,
            expected.data,
            diff.data,
            actual.width,
            actual.height,
            { threshold: 0.1 },
          );
          const ratio = diffPixels / (actual.width * actual.height);
          if (ratio <= MAX_DIFF_RATIO) return result('match', ratio);

          fs.mkdirSync(diffDir, { recursive: true });
          fs.writeFileSync(path.join(diffDir, `${name}.png`), PNG.sync.write(diff));
          return result(
            'mismatch',
            ratio,
            `${diffPixels} pixels differ (${(ratio * 100).toFixed(2)}% > ${MAX_DIFF_RATIO * 100}%); diff saved to ${diffDir}`,
          );
        },
      });
    },
  },
  screenshotsFolder,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'reports/cypress-json',
    overwrite: true,
    reportFilename: '[name]',
    html: false,
    json: true,
  },
});
