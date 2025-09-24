import { test, expect } from '@playwright/test';

test('rota protegida exige login', async ({ page }) => {
  await page.goto('/profile');
  await page.waitForURL('**/login');
  await page.waitForSelector('form');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
