import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, setTokens, getAccessToken, clearAuth, setUser, getUser } from '@/lib/auth';

describe('auth storage helpers', () => {
  beforeEach(() => localStorage.clear());

  it('setTokens/getAccessToken', () => {
    setTokens('abc', 'def');
    expect(getAccessToken()).toBe('abc');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('def');
  });

  it('setUser/getUser', () => {
    setUser({ id: 1, name: 'x' });
    expect(getUser<{ id: number; name: string }>()).toEqual({ id: 1, name: 'x' });
  });

  it('clearAuth', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'a');
    localStorage.setItem(REFRESH_TOKEN_KEY, 'b');
    localStorage.setItem(USER_KEY, '{"x":1}');
    clearAuth();
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
