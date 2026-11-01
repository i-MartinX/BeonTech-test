/**
 * Assembles the GitHub Pages site into ./site:
 *   /                      the React report (report/dist)
 *   /native/playwright     Playwright's own HTML report
 *   /native/cypress        Cypress mochawesome HTML report
 *   /results.json          merged results
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');

const copy = (from: string, to: string) => {
  const src = path.join(root, from);
  if (!fs.existsSync(src)) {
    console.warn(`skip ${from} (not found)`);
    return;
  }
  fs.cpSync(src, path.join(site, to), { recursive: true });
  console.log(`${from} -> site/${to}`);
};

fs.rmSync(site, { recursive: true, force: true });
copy('report/dist', '.');
copy('reports/playwright-html', 'native/playwright');
copy('reports/cypress-html', 'native/cypress');
copy('report/src/data/results.json', 'results.json');
