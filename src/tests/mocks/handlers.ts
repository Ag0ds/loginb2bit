import { http, HttpResponse } from 'msw';

const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.homologation.cliqdrive.com.br';

export const handlers = [
  http.post(`${base}/auth/login/`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'cliente@youdrive.com' && body.password === 'password') {
      return HttpResponse.json({
        user: { id: 4, email: body.email, name: 'Cliente' },
        tokens: { access: 'access-token-mock', refresh: 'refresh-token-mock' },
      });
    }
    return new HttpResponse(JSON.stringify({
      email: ['Este campo é obrigatório.'],
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }),

  http.get(`${base}/auth/profile/`, async ({ request }) => {
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ detail: 'Token missing' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }
    return HttpResponse.json({
      id: 'uuid',
      avatar: null,
      name: 'Miguel',
      last_name: 'Rocha',
      email: 'miguel@b2bit.company',
      role: { value: 0, label: 'Staff' },
      last_login: '2022-03-08T14:28:39.781811Z',
      staff_role: { value: 0, label: 'Admin' },
    });
  }),
];
