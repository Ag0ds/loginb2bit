import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import api from '@/lib/axios';

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
  interceptors: any;
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockedApi.post.mockReset();
    localStorage.clear();
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
    await userEvent.type(screen.getByLabelText(/senha/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(localStorage.getItem('access_token')).toBe('access-token-mock');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token-mock');
  });

  it('exibe erro 400 do servidor abaixo do campo', async () => {
    mockedApi.post.mockRejectedValueOnce({
      response: { status: 400, data: { email: ['Este campo é obrigatório.'] } },
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'foo@bar.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'errada');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/este campo é obrigatório/i)).toBeInTheDocument();
  });
});
