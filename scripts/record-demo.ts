/**
 * Records the checkout scenario as a short headless video for the report (report/public/checkout-demo.webm).
 * Not part of CI: run it by hand when the demo should change.  Usage: npx tsx scripts/record-demo.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { CHECKOUT_INFO, URLS, USERS, VISUAL } from '../shared/data';

const out = path.resolve(__dirname, '..', 'report', 'public', 'checkout-demo.webm');
const tmp = path.resolve(__dirname, '..', 'reports', 'demo-video');

(async () => {
  fs.rmSync(tmp, { recursive: true, force: true });
  const browser = await chromium.launch({ headless: true, slowMo: 450 });
  const context = await browser.newContext({
    viewport: VISUAL.viewport,
    recordVideo: { dir: tmp, size: { width: 960, height: 540 } },
  });
  const page = await context.newPage();

  await page.goto(URLS.ui);
  await page.locator('[data-test="username"]').fill(USERS.standard.username);
  await page.locator('[data-test="password"]').fill(USERS.standard.password);
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill(CHECKOUT_INFO.firstName);
  await page.locator('[data-test="lastName"]').fill(CHECKOUT_INFO.lastName);
  await page.locator('[data-test="postalCode"]').fill(CHECKOUT_INFO.postalCode);
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="complete-header"]').waitFor();
  await page.waitForTimeout(1200);

  const video = page.video()!;
  await context.close();
  await browser.close();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(await video.path(), out);
  console.log(`Saved ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
})();
