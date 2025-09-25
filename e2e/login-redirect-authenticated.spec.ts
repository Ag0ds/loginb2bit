import { test, expect } from '@playwright/test';

test('usuario logado não acessa /login (redirect server-side ou client-side)', async ({ page }) => {
  await page.goto('/login');
  await page.waitForURL('**/login');
  await page.evaluate(async () => {
    await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access: 'access-token-mock',
        refresh: 'refresh-token-mock',
      }),
    });
    localStorage.setItem('access_token', 'access-token-mock');
    localStorage.setItem('refresh_token', 'refresh-token-mock');
  });
  await page.reload();
  await page.waitForURL('**/profile');
  await expect(page).toHaveURL(/\/profile$/);
});
