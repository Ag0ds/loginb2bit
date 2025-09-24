import { test, expect } from '@playwright/test';

const API = 'https://api.homologation.cliqdrive.com.br';

test('logout limpa credenciais e volta ao /login', async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'access-token-mock');
    localStorage.setItem('refresh_token', 'refresh-token-mock');
  });
  await page.route(`${API}/auth/profile/`, async (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'uuid',
          avatar: null,
          name: 'Miguel',
          last_name: 'Rocha',
          email: 'miguel@b2bit.company',
          role: { value: 0, label: 'Staff' },
          last_login: '2022-03-08T14:28:39.781811Z',
          staff_role: { value: 0, label: 'Admin' },
        }),
      });
    }
    return route.continue();
  });
  await page.goto('/profile');
  await expect(page.getByText(/Miguel\s+Rocha/i)).toBeVisible();
  await page.getByRole('button', { name: /logout/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  const access = await page.evaluate(() => localStorage.getItem('access_token'));
  const refresh = await page.evaluate(() => localStorage.getItem('refresh_token'));
  expect(access).toBeNull();
  expect(refresh).toBeNull();
});
