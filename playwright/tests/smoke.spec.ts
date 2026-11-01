import { test, expect } from '@playwright/test';

test('SauceDemo login page loads', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('Restful-Booker health check', async ({ request }) => {
  const res = await request.get('https://restful-booker.herokuapp.com/ping');
  expect(res.status()).toBe(201);
});
