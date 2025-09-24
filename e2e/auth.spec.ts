import { test, expect } from '@playwright/test';

test('rota protegida exige login', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();
});
