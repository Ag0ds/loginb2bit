import { test, expect } from '@playwright/test';

const API = 'https://api.homologation.cliqdrive.com.br';

test('login sucesso: salva tokens e redireciona para /profile', async ({ page }) => {
  await page.route(`${API}/auth/login/`, async (route, request) => {
    if (request.method() === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 4, email: 'cliente@youdrive.com', name: 'Cliente' },
          tokens: { access: 'access-token-mock', refresh: 'refresh-token-mock' },
        }),
      });
    }
    return route.continue();
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

  await page.goto('/login');
  await page.getByLabel(/e-mail/i).fill('cliente@youdrive.com');
  await page.getByLabel(/senha/i).fill('password');
  await page.getByRole('button', { name: /entrar/i }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(/Miguel\s+Rocha/i)).toBeVisible();

  const access = await page.evaluate(() => localStorage.getItem('access_token'));
  const refresh = await page.evaluate(() => localStorage.getItem('refresh_token'));
  expect(access).toBe('access-token-mock');
  expect(refresh).toBe('refresh-token-mock');
});

test('login falha (400): mostra erro no campo e permanece em /login', async ({ page }) => {
  await page.route(`${API}/auth/login/`, async (route, request) => {
    if (request.method() === 'POST') {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ email: ['Este campo é obrigatório.'] }),
      });
    }
    return route.continue();
  });

  await page.goto('/login');
  await page.getByLabel(/e-mail/i).fill('foo@bar.com');
  await page.getByLabel(/senha/i).fill('errada');
  await page.getByRole('button', { name: /entrar/i }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText(/este campo é obrigatório/i)).toBeVisible();
});
