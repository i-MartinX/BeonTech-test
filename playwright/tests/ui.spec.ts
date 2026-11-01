import { test, expect, Page } from '@playwright/test';
import { CHECKOUT_INFO, URLS, USERS } from '../../shared/data';

async function login(page: Page, user: { username: string; password: string }) {
  await page.goto(URLS.ui);
  await page.locator('[data-test="username"]').fill(user.username);
  await page.locator('[data-test="password"]').fill(user.password);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('UI', () => {
  test('[UI-01] standard user logs in and sees 6 products', async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('[UI-02] locked-out user sees an error', async ({ page }) => {
    await login(page, USERS.locked);
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('[UI-03] invalid credentials show an error', async ({ page }) => {
    await login(page, USERS.invalid);
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match',
    );
  });

  test('[UI-04] sort products by price low to high', async ({ page }) => {
    await login(page, USERS.standard);
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = (await page.locator('[data-test="inventory-item-price"]').allInnerTexts()).map(
      (t) => parseFloat(t.replace('$', '')),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('[UI-05] adding to cart updates the badge', async ({ page }) => {
    await login(page, USERS.standard);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('[UI-06] complete checkout flow', async ({ page }) => {
    await login(page, USERS.standard);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill(CHECKOUT_INFO.firstName);
    await page.locator('[data-test="lastName"]').fill(CHECKOUT_INFO.lastName);
    await page.locator('[data-test="postalCode"]').fill(CHECKOUT_INFO.postalCode);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      'Thank you for your order!',
    );
  });

  test('[UI-07] inventory still renders when product images fail', async ({ page }) => {
    await page.route('**/*.jpg', (route) => route.abort());
    await login(page, USERS.standard);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toBeVisible();
  });
});
