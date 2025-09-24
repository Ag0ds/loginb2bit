import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/(protected)/profile/page';
import { setTokens } from '@/lib/auth';
import api from '@/lib/axios';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const mockedApi = api as unknown as { get: jest.Mock };

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear();
    setTokens('access-token-mock');
    mockedApi.get.mockReset();
  });

  it('renderiza dados do profile quando autenticado', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        id: 'uuid',
        avatar: null,
        name: 'Miguel',
        last_name: 'Rocha',
        email: 'miguel@b2bit.company',
        role: { value: 0, label: 'Staff' },
        last_login: '2022-03-08T14:28:39.781811Z',
        staff_role: { value: 0, label: 'Admin' },
      },
    });

    render(<ProfilePage />);

    expect(await screen.findByText(/Miguel Rocha/i)).toBeInTheDocument();
    expect(screen.getByText(/miguel@b2bit.company/i)).toBeInTheDocument();
    const roleLine = screen.getByText((_, el) =>
      !!el?.textContent && /^Role:\s*Staff$/i.test(el.textContent)
    );
    expect(roleLine).toBeInTheDocument();

    const staffLine = screen.getByText((_, el) =>
      !!el?.textContent && /^Staff:\s*Admin$/i.test(el.textContent)
    );
    expect(staffLine).toBeInTheDocument();
      });
});
