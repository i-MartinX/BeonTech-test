import { test, expect, Page } from '@playwright/test';
import { CHECKOUT_INFO, URLS, USERS, VISUAL } from '../../shared/data';

const shot = { maxDiffPixelRatio: 0.01, animations: 'disabled' } as const;

async function login(page: Page, user: { username: string; password: string }) {
  await page.goto(URLS.ui);
  await page.locator('[data-test="username"]').fill(user.username);
  await page.locator('[data-test="password"]').fill(user.password);
  await page.locator('[data-test="login-button"]').click();
}

// The app is a single-page app, so the scroll position survives navigation and depends on how far
// Playwright scrolled to click the previous button. Fix it, or the same page screenshots differently.
const settle = (page: Page) => page.evaluate(() => window.scrollTo(0, 0));

test.describe('Visual', () => {
  test.use({ viewport: VISUAL.viewport });

  test('[VIS-01] inventory page matches the baseline', async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await settle(page);
    await expect(page).toHaveScreenshot(`${VISUAL.snapshots['VIS-01']}.png`, shot);
  });

  test('[VIS-02] login error state matches the baseline', async ({ page }) => {
    await login(page, USERS.locked);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot(`${VISUAL.snapshots['VIS-02']}.png`, shot);
  });

  test('[VIS-03] order confirmation matches the baseline', async ({ page }) => {
    await login(page, USERS.standard);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill(CHECKOUT_INFO.firstName);
    await page.locator('[data-test="lastName"]').fill(CHECKOUT_INFO.lastName);
    await page.locator('[data-test="postalCode"]').fill(CHECKOUT_INFO.postalCode);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot(`${VISUAL.snapshots['VIS-03']}.png`, shot);
  });
});
