import api from '@/lib/axios';
import MockAdapter from 'axios-mock-adapter';
import { setTokens } from '@/lib/auth';

describe('axios interceptors', () => {
  let errSpy: jest.SpyInstance;

  beforeEach(() => {
    localStorage.clear();
    errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errSpy.mockRestore();
  });

  it('injeta Authorization quando há access token', async () => {
    setTokens('token-123');

    const mock = new MockAdapter(api);
    mock.onGet('/echo-auth').reply((config) => {
      const auth =
        (config.headers?.Authorization as string) ||
        (config.headers?.authorization as string) ||
        '';
      return [200, { auth }];
    });

    const res = await api.get('/echo-auth');
    expect(res.data.auth).toBe('Bearer token-123');
  });

  it('limpa auth no 401', async () => {
    setTokens('will-expire');

    const mock = new MockAdapter(api);
    mock.onGet('/protected').reply(401);

    await expect(api.get('/protected')).rejects.toBeTruthy();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
