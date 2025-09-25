import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import api from '@/lib/axios';

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, push: jest.fn(), prefetch: jest.fn() }),
}));


jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const mockedApi = api as unknown as {
  post: jest.Mock;
  get: jest.Mock;
  interceptors: {
    request: { use: jest.Mock };
    response: { use: jest.Mock };
  };
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockedApi.post.mockReset();
    replaceMock.mockReset();
    localStorage.clear();

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as unknown as Response);
  });

  afterEach(() => {
    (global.fetch as jest.Mock)?.mockRestore?.();
  });

  it('faz login com sucesso, salva tokens e redireciona', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        user: { id: 4, email: 'cliente@youdrive.com', name: 'Cliente' },
        tokens: { access: 'access-token-mock', refresh: 'refresh-token-mock' },
      },
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'cliente@youdrive.com');
    await userEvent.type(screen.getByLabelText(/password|senha/i), 'password');

    const submitBtn =
      screen.queryByRole('button', { name: /entrar/i }) ??
      screen.getByRole('button', { name: /sign ?in|sing ?in/i });
    await userEvent.click(submitBtn);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login/', {
      email: 'cliente@youdrive.com',
      password: 'password',
    });
    expect(localStorage.getItem('access_token')).toBe('access-token-mock');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token-mock');
    expect(replaceMock).toHaveBeenCalledWith('/profile');
  });

  it('exibe erro 400 do servidor abaixo do campo', async () => {
    mockedApi.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { password: ['Este campo é obrigatório'] },
      },
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'foo@bar.com');
    await userEvent.type(screen.getByLabelText(/password|senha/i), 'errada');

    const submitBtn =
      screen.queryByRole('button', { name: /entrar/i }) ??
      screen.getByRole('button', { name: /sign ?in|sing ?in/i });
    await userEvent.click(submitBtn);

    expect(await screen.findByText(/este campo é obrigatório/i)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
